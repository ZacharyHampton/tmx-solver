from .grpc_schema import services_pb2_grpc, services_pb2
import grpc
from .exceptions import FailedToValidateScriptException
from .device import Device
from ..config import GRPC_HOSTNAME
from typing import NewType


class Solver:
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            script_type: str,
            headers: dict = None,
            proxy: str = None
    ):
        self.script = script
        self.device = device
        self.headers = headers
        self.session_id = session_id
        self.proxy = proxy
        self.script_type = script_type

        if self.headers is None:
            self.headers = {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'none',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            }

        self.tags = self._get_tags()

    def _get_tags(self):
        with grpc.insecure_channel('{}:50051'.format(GRPC_HOSTNAME)) as channel:
            stub = services_pb2_grpc.LinkingServiceStub(channel)

            response = stub.LinkURLs(services_pb2.LinkURLsMessage(
                script=self.script,
                script_type=self.script_type,
            ))

            if response.error:
                raise FailedToValidateScriptException('Failed to get {} script tags.'.format(self.script_type.lower()))

            tags = response.urls

            return {
                tag: tags[tag].urls[0]
                if len(tags[tag].urls) == 1
                else tags[tag].urls
                for tag in tags
            }

    def solve(self): ...
