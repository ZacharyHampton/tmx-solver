from .device import Device
import httpx
import asyncio
from .solver import Solver
from .encrypt import encrypt
from .payload import Payload
from httpx import AsyncClient
from http.cookiejar import CookieJar


class Profiling(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            cookie_jar: CookieJar,
            headers: dict,
            proxy: str | None = None,
    ):
        super().__init__(script, device, session_id, "PROFILING", cookie_jar)

        self.headers = headers
        self.proxy = proxy

        self.profiling_payload = Payload(
            required_fields=[
                "jsou",
                "jso",
                "jsbu",
                "jsb",
            ],
            optional_fields=[
                "jsmu"
            ],
        )

    def solve(self) -> str:
        main_script = asyncio.run(self._submit_profiling_data())
        asyncio.run(self._request_to_images())

        return main_script

    async def _request_to_images(self):
        urls = [self.tags["embedded_image_img"], self.tags["embedded_image_p"]]

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            await asyncio.gather(*[client.get(url) for url in urls])

    async def _submit_profiling_data(self) -> str:
        payload = self.profiling_payload

        query = payload.get_query_string(self.device)
        encrypted_query = encrypt(query, self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                self.tags['profiling_url'] + '&jb={}'.format(encrypted_query),
            )

            return response.text
