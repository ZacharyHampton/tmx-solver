from .device import Device
import httpx
import asyncio
from .solver import Solver
from .encrypt import encrypt


class MainScript(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            headers: dict = None,
            proxy: str = None
    ):
        super().__init__(script, device, session_id, "MAIN", headers, proxy)

        self.required_fields = [
        ]

        self.optional_fields = [
        ]

    def solve(self) -> str: ...
