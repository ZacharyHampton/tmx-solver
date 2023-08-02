import requests
from ...exceptions import FailedToRetrieveScriptException, FailedToValidateScriptException
from ...grpc_schema import services_pb2_grpc, services_pb2
from solver.api.core.solver.solvers.profiling import Profiling
from solver.api.core.solver.solvers.solver import TMXRequest
from solver.api.core.solver.solvers.main_script import MainScript
from ...device import Device
from ....config import GRPC_HOSTNAME
import grpc
import hashlib
import re
import httpx
from http.cookiejar import CookieJar


class Site:
    def __init__(
            self,
            site_name: str,
            site_domain: str,
            config_url: str,
            tmx_hostname: str,
            org_id: str,
            headers: dict = None,
            needs_parsing: bool = False,
    ):
        self.site_name = site_name
        self.site_domain = site_domain
        self.config_url = config_url
        self.headers = headers
        self.needs_parsing = needs_parsing

        #: params for tmx profiling url

        """
        How the tmx initial profiling url works:
        
        "https://<tmx_hostname>/<random string>.js?<params>"
        
        params tend to be:
        key: random string
        values:
        org_id
        session_id
        other custom values
        """

        self.tmx_hostname = tmx_hostname
        self.org_id = org_id

    def parse(self, data: str) -> str:
        ...

    @staticmethod
    def get_testing_device(devices: list[Device]):
        for device in devices:
            if device.data['lsa'] == 'c06ab5e4b215443f863de014754145c0':
                return device

    def solve(
            self,
            session_id: str,
            device: Device,
            url: str = None,
            proxy: str = None,
            predefined_script: bool = False,
            profiling_script: str = None,
            main_script: str = None,
            iframes: dict[str, str] = None,
    ) -> tuple[bool, list[TMXRequest]]:
        if url is None:
            url = f'https://www.{self.site_domain}/'

        device.data['dr'] = f'https://www.{self.site_domain}/'
        device.data['lh'] = url[:255]
        hh_str = self.org_id + session_id
        device.data['hh'] = hashlib.md5(hh_str.encode()).hexdigest()
        self.headers['user-agent'] = device.data['lq']

        if proxy is not None:
            proxy = 'http://' + proxy

        cookie_jar = CookieJar()

        if predefined_script is False:
            script = self.get_config_script()

            profiling_url = self.get_tmx_profiling_url(script, session_id)

            with httpx.Client(headers=self.headers, proxies=proxy, cookies=cookie_jar) as session:
                response = session.get(profiling_url)
                profiling_script = response.text

        profiling = Profiling(self.reveal_strings(profiling_script), device, session_id, cookie_jar=cookie_jar,
                              headers=self.headers, proxy=proxy)

        if predefined_script is False:
            main_script = profiling.solve()
        else:
            profiling.solve()

        main_script_revealed = self.reveal_strings(main_script)
        _, lsa = re.findall(r'([A-Fa-f0-9]{32})_', main_script_revealed)

        device.data['lsa'] = lsa

        main = MainScript(main_script_revealed, device, session_id, org_id=self.org_id, cookie_jar=cookie_jar,
                          headers=self.headers, proxy=proxy, reveal_strings=self.reveal_strings, predefined_iframes=iframes)
        main.solve()

        solver_analytic_requests = []
        solver_analytic_requests += profiling.process_requests_queue()
        solver_analytic_requests += main.process_requests_queue()

        return True, solver_analytic_requests

    def test_solve(self, session_id: str, proxy: str = None) -> bool:
        ...

    @staticmethod
    def validate_session_id(session_id: str) -> bool:
        ...

    def generate_test_session_id(self) -> str:
        ...

    def get_config_script(self):
        if self.headers is not None:
            response = requests.get(self.config_url, headers=self.headers)
        else:
            response = requests.get(self.config_url)

        if response.status_code != 200:
            raise FailedToRetrieveScriptException(f'Failed to retrieve script from {self.config_url}')

        if self.needs_parsing:
            return self.parse(response.text)
        else:
            return response.text

    def get_tmx_profiling_url(self, script: str, session_id: str, params: list = None) -> str:
        if params is None:
            params = [self.org_id, session_id]
        else:
            params = [self.org_id, session_id] + params

        with grpc.insecure_channel('{}:50051'.format(GRPC_HOSTNAME)) as channel:
            stub = services_pb2_grpc.TransformationServiceStub(channel)

            response = stub.CreateURLVM(services_pb2.CreateURLVMMessage(
                script=script,
                hostname=self.tmx_hostname,
                params=params,
            ))

            if response.error:
                raise FailedToValidateScriptException(f'Failed to generate profiling URL for {self.site_name}')

            return response.url

    def reveal_strings(self, script: str) -> str:
        with grpc.insecure_channel('{}:50051'.format(GRPC_HOSTNAME)) as channel:
            stub = services_pb2_grpc.TransformationServiceStub(channel)

            response = stub.Transform(services_pb2.TransformationMessage(
                script=script,
                transformation_type="tagging"
            ))

            if response.error:
                raise FailedToValidateScriptException(f'Failed to reveal strings for {self.site_name}')

            return response.script
