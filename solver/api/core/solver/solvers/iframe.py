from solver.api.core.solver.device import Device
import httpx
import asyncio
from .solver import Solver, TMXPayload
from solver.api.core.solver.encrypt import encrypt
from solver.api.core.solver.payload import Payload
from httpx import AsyncClient
from http.cookiejar import CookieJar


class IFrame(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            cookie_jar: CookieJar,
            headers: dict,
            proxy: str | None = None,
    ):
        super().__init__(script, device, session_id, "IFRAME", cookie_jar)

        self.headers = headers
        self.proxy = proxy

    def solve(self): ...
