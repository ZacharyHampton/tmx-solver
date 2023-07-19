from .device import Device
import httpx
import asyncio
from .solver import Solver
from .encrypt import encrypt


class Profiling(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            headers: dict = None,
            proxy: str = None
    ):
        super().__init__(script, device, session_id, "PROFILING", headers, proxy)

        self.required_fields = [
            "jsou",
            "jso",
            "jsbu",
            "jsb",
        ]

        self.optional_fields = [
            "jsmu"
        ]

    def solve(self) -> str:
        main_script = asyncio.run(self._submit_profiling_data())
        asyncio.run(self._request_to_images())

        return main_script

    async def _request_to_images(self):
        urls = [self.tags["embedded_image_img"], self.tags["embedded_image_p"]]

        async with httpx.AsyncClient(proxies=self.proxy) as client:
            await asyncio.gather(*[client.get(url) for url in urls])

    async def _submit_profiling_data(self) -> str:
        query = self.json_to_query_string(self._get_required_device_data())
        encrypted_query = encrypt(query, self.session_id)

        async with httpx.AsyncClient(proxies=self.proxy) as client:
            response = await client.get(
                self.tags["profiling_url"] + '&jb={}'.format(encrypted_query),
                headers=self.headers,
            )

            return response.text
