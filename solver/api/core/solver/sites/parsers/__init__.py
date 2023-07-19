import requests
from ...exceptions import FailedToRetrieveScriptException, FailedToValidateScriptException
from ...grpc_schema import services_pb2_grpc, services_pb2
from ...profiling import Profiling
from ...device import Device
from ....config import GRPC_HOSTNAME
import grpc


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

    def parse(self, data: str) -> str: ...

    def solve(self, session_id: str, device: Device, proxy: str = None) -> bool:
        script = self.get_config_script()

        profiling_url = self.get_tmx_profiling_url(script, session_id)

        if proxy is not None:
            proxy = 'http://' + proxy

        response = requests.get(profiling_url, headers=self.headers, proxies={
            'https': proxy,
            'http': proxy
        } if proxy is not None else None)

        profiling = Profiling(self.reveal_strings(response.text), device, session_id, proxy=proxy)

        profiling.solve()

        return True

    def test_solve(self, session_id: str, proxy: str = None) -> bool: ...

    @staticmethod
    def validate_session_id(session_id: str) -> bool: ...

    def generate_test_session_id(self) -> str: ...

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
                fast=True,
            ))

            if response.error:
                raise FailedToValidateScriptException(f'Failed to reveal strings for {self.site_name}')

            return response.script


