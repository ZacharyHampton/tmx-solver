from .grpc_schema import services_pb2_grpc, services_pb2
import grpc
from .exceptions import FailedToValidateScriptException
from .device import Device
from ..config import GRPC_HOSTNAME
from typing import NewType
from httpx import AsyncClient


class Solver:
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            script_type: str,
            session: AsyncClient,
    ):
        self.script = script
        self.device = device
        self.session_id = session_id
        self.script_type = script_type
        self.session = session

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
