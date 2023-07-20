from .device import Device
import httpx
import asyncio
from .solver import Solver
from .encrypt import encrypt
from .payload import Payload
from httpx import AsyncClient


class Profiling(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            session: AsyncClient,
    ):
        super().__init__(script, device, session_id, "PROFILING", session)

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

        async with self.session as client:
            await asyncio.gather(*[client.get(url) for url in urls])

    async def _submit_profiling_data(self) -> str:
        payload = self.profiling_payload

        query = payload.get_query_string(self.device)
        encrypted_query = encrypt(query, self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['profiling_url'] + '&jb={}'.format(encrypted_query),
            )

            return response.text
