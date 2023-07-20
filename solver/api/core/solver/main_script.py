from .device import Device
import httpx
from httpx import AsyncClient
import asyncio
from .solver import Solver
from .encrypt import encrypt
from .payload import Payload
from urllib.parse import quote


class MainScript(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            org_id: str,
            session: AsyncClient,
    ):
        super().__init__(script, device, session_id, "MAIN", session)
        self.org_id = org_id

        #: process of main script
        #: fp png image

        self.lsa_payload = Payload(required_fields=["lsa"])

        #: the 3 iframes

        self.main_payload_ja = Payload(required_fields=[
            "c",
            "z",
            "f",
            "af",
            "sxy",
            "dpr",
            "mt",
            "mn",
            "scd",
            "lh",
            "pl",
            "ph",
            "hh",
            "jso",
            "jsb",
            "jsou",
            "jsbu",
            "nhc",
            "ndm",
            "nmtp",
            "tzd",
            "mathr",
            "dr",
            "p",
            "gl_c",
            "gl_h",
            "wglv",
            "wglr",
            "ccd",
        ])

        self.main_payload_jb = Payload(required_fields=[
            "lq"
        ])

        #: online matrix image

        self.medh_payload = Payload(required_fields=["medh"])

        self.fp_payload = Payload(required_fields=[
            "jfn",
            "jfh",
            "jftn",
            "pm",
            "batst"
            "audh",
            "ex3",
        ])

        self.lsb_payload = Payload(required_fields=["lsb"])

        self.jwk_payload = Payload(required_fields=[
            "sid_rnd",
            "sid_date",
            "sid_type",
            "sid_key",
            "sid_sig",
            "sifr",
        ])  #: probably is dynamic

        #: ip payload = wei = ip address

        self.rev_payload = Payload(required_fields=["rev"])

    def solve(self) -> bool:
        asyncio.run(self.request_fp_clear_image())
        lsa = asyncio.run(self.send_lsa_payload())
        asyncio.run(self.request_to_iframes())
        main = asyncio.run(self.send_main_payload())
        asyncio.run(self.request_to_online_matrix_image())
        medh = asyncio.run(self.send_medh_payload())
        fp = asyncio.run(self.send_fp_payload())
        lsb = asyncio.run(self.send_lsb_payload())
        jwk = asyncio.run(self.send_jwk_payload())
        ip = asyncio.run(self.send_ip_payload())
        rev = asyncio.run(self.send_rev_payload())

        return True

    async def send_rev_payload(self):
        je = encrypt(self.rev_payload.get_query_string(self.device), self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['rev_payload'] + '&je={}'.format(je),
            )

            return response.status_code == 204

    async def send_ip_payload(self):
        async with self.session as client:
            ip_response = await client.get('https://api.ipify.org?format=json')

            ip = ip_response.json()['ip']
            je = encrypt("wei={}".format(quote(ip)), self.session_id)

            response = await client.get(
                self.tags['jwk_payload'] + '&jac=1&je={}'.format(je),
            )

            return response.status_code == 204

    async def send_jwk_payload(self):
        jf = encrypt(self.jwk_payload.get_query_string(self.device, include_ampersand=True)[1:], self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['jwk_payload'] + '&jf={}'.format(jf),
            )

            return response.status_code == 204

    async def send_lsb_payload(self):
        jf = encrypt(self.lsb_payload.get_query_string(self.device, include_ampersand=False), self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['lsa_payload'] + '&jf={}'.format(jf),
            )

            return response.status_code == 204

    async def send_fp_payload(self):
        je = encrypt(self.fp_payload.get_query_string(self.device), self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['main_url_payload'] + '&jac=1&ja={}'.format(je),
            )

            return response.status_code == 204

    async def send_medh_payload(self):
        je = encrypt(self.medh_payload.get_query_string(self.device), self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['medh_payload'] + '&jac=1&je={}'.format(je),
            )

            return response.status_code == 204

    async def send_main_payload(self):
        main_query_string = self.main_payload_ja.get_query_string(self.device)

        ja = encrypt(main_query_string, self.session_id)
        jb = encrypt(self.main_payload_jb.get_query_string(self.device, include_ampersand=False), self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['main_url_payload'] + '&ja={}&jb={}'.format(ja, jb),
            )

            return response.status_code == 204

    async def send_lsa_payload(self):
        jb = encrypt(self.lsa_payload.get_query_string(self.device, include_ampersand=False), self.session_id)

        async with self.session as client:
            response = await client.get(
                self.tags['lsa_payload'] + '&jb={}'.format(jb),
            )

            return response.status_code == 204

    async def request_fp_clear_image(self):
        headers = self.session.headers.copy()
        tag_from = self.tags['embedded_img_online_metrix']
        index = tag_from.index('sac.d.aa.online-metrix.net')
        code = tag_from[index-16:index]
        key = self.org_id + "/" + code + self.session_id

        headers['accept'] = "*/*, " + key

        async with self.session as client:
            await client.get(self.tags["embedded_image_fp_clear_png"], headers=headers)

    async def request_to_iframes(self):
        urls = self.tags["online_metrix_iframe"]

        async with self.session as client:
            await asyncio.gather(*[client.get(url) for url in urls])

    async def request_to_online_matrix_image(self):
        async with self.session as client:
            await client.get(self.tags["embedded_img_online_metrix"])
