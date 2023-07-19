from .grpc_schema import services_pb2_grpc, services_pb2
import grpc
from .exceptions import FailedToValidateScriptException
from .device import Device
import httpx
import asyncio
from urllib.parse import urlencode, quote
from ..config import GRPC_HOSTNAME
from .encrypt import encrypt


class Profiling:
    def __init__(self, script: str, device: Device, session_id: str, headers: dict = None):
        self.script = script
        self.device = device
        self.headers = headers
        self.session_id = session_id

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

        self.required_fields = [
            "jsou",
            "jso",
            "jsbu",
            "jsb",
        ]

        self.optional_fields = [
            "jsmu"
        ]

    def _get_required_device_data(self):
        fields = self.required_fields + self.optional_fields

        return {field: self.device.data[field] for field in fields if self.device.data.get(field) is not None}

    def _get_tags(self):
        with grpc.insecure_channel('{}:50051'.format(GRPC_HOSTNAME)) as channel:
            stub = services_pb2_grpc.LinkingServiceStub(channel)

            response = stub.LinkURLs(services_pb2.LinkURLsMessage(
                script=self.script,
                script_type="PROFILING",
            ))

            if response.error:
                raise FailedToValidateScriptException(f'Failed to get profiling tags.')

            return response.urls

    def solve(self) -> str:
        main_script = asyncio.run(self._submit_profiling_data())
        asyncio.run(self._request_to_images())

        return main_script

    @staticmethod
    def json_to_query_string(json: dict) -> str:
        placeholder = ""

        for key, value in json.items():
            placeholder += f"&{key}={quote(value)}"

        return placeholder

    async def _request_to_images(self):
        urls = [self.tags["embedded_image_img"], self.tags["embedded_image_p"]]

        async with httpx.AsyncClient() as client:
            await asyncio.gather(*[client.get(url) for url in urls])

    async def _submit_profiling_data(self) -> str:
        query = self.json_to_query_string(self._get_required_device_data())
        encrypted_query = encrypt(query, self.session_id)

        async with httpx.AsyncClient() as client:
            response = await client.get(
                self.tags["profiling_url"] + '&jb={}'.format(encrypted_query),
                headers=self.headers,
            )

            return response.text
