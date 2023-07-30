from solver.api.core.solver.device import Device
import httpx
from httpx import AsyncClient
import asyncio
from .solver import Solver, TMXPayload
from .iframe import IFrame
from solver.api.core.solver.encrypt import encrypt
from solver.api.core.solver.payload import Payload
from urllib.parse import quote
from http.cookiejar import CookieJar
from bs4 import BeautifulSoup
from typing import Callable


class MainScript(Solver):
    def __init__(
            self,
            script: str,
            device: Device,
            session_id: str,
            org_id: str,
            cookie_jar: CookieJar,
            headers: dict,
            reveal_strings: Callable,
            proxy: str | None = None,
            predefined_iframes: dict[str, str] = None,
    ):
        super().__init__(script, device, session_id, "MAIN", cookie_jar)

        self.org_id = org_id
        self.headers = headers
        self.proxy = proxy
        self.reveal_strings = reveal_strings
        self.predefined_iframes = predefined_iframes

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
        jwk = asyncio.run(self.send_jwk_payload())
        ip = asyncio.run(self.send_ip_payload())
        rev = asyncio.run(self.send_rev_payload())

        return True

    async def send_rev_payload(self):
        je = encrypt(decoded_payload := self.rev_payload.get_query_string(self.device), self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                self.tags['rev_payload'] + '&je={}'.format(je),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="je",
                                     raw_payload=je,
                                     decoded_payload=decoded_payload,
                                     json_payload=self.rev_payload.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def send_ip_payload(self):
        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            ip_response = await client.get('https://api.ipify.org?format=json')

            ip = ip_response.json()['ip']
            je = encrypt(decoded_payload := "wei={}".format(quote(ip)), self.session_id)

            response = await client.get(
                self.tags['main_url_payload'] + '&jac=1&je={}'.format(je),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="jac",
                                     raw_payload="1",
                                 ),
                                 TMXPayload(
                                     key="je",
                                     raw_payload=je,
                                     decoded_payload=decoded_payload,
                                     json_payload={"wei": ip}
                                 )
                             ])

            return response.status_code == 204

    async def send_jwk_payload(self, url: str = None):
        jf = encrypt(decoded_payload := (self.jwk_payload.get_query_string(self.device, include_ampersand=True)[1:]),
                     self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            url = url or self.tags['jwk_payload']

            response = await client.get(
                url + '&jf={}'.format(jf),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="jf",
                                     raw_payload=jf,
                                     decoded_payload=decoded_payload,
                                     json_payload=self.jwk_payload.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def send_lsb_payload(self, url: str):
        jf = encrypt(decoded_payload := self.lsb_payload.get_query_string(self.device, include_ampersand=False),
                     self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                url + '&jf={}'.format(jf),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="jf",
                                     raw_payload=jf,
                                     decoded_payload=decoded_payload,
                                     json_payload=self.lsb_payload.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def send_fp_payload(self):
        je = encrypt(decoded_payload := self.fp_payload.get_query_string(self.device), self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                self.tags['main_url_payload'] + '&jac=1&ja={}'.format(je),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="jac",
                                     raw_payload="1",
                                 ),
                                 TMXPayload(
                                     key="ja",
                                     raw_payload=je,
                                     decoded_payload=decoded_payload,
                                     json_payload=self.fp_payload.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def send_medh_payload(self):
        je = encrypt(decoded_payload := self.medh_payload.get_query_string(self.device), self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                self.tags['medh_payload'] + '&jac=1&je={}'.format(je),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="jac",
                                     raw_payload="1",
                                 ),
                                 TMXPayload(
                                     key="je",
                                     raw_payload=je,
                                     decoded_payload=decoded_payload,
                                     json_payload=self.medh_payload.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def send_main_payload(self):
        main_query_string = self.main_payload_ja.get_query_string(self.device)

        ja = encrypt(main_query_string, self.session_id)
        jb = encrypt(jb_payload := self.main_payload_jb.get_query_string(self.device, include_ampersand=False),
                     self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                self.tags['main_url_payload'] + '&ja={}&jb={}'.format(ja, jb),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="ja",
                                     raw_payload=ja,
                                     decoded_payload=main_query_string,
                                     json_payload=self.main_payload_ja.get_required_device_data(self.device)
                                 ),
                                 TMXPayload(
                                     key="jb",
                                     raw_payload=jb,
                                     decoded_payload=jb_payload,
                                     json_payload=self.main_payload_jb.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def send_lsa_payload(self):
        jb = encrypt(decoded_payload := self.lsa_payload.get_query_string(self.device, include_ampersand=False),
                     self.session_id)

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(
                self.tags['main_url_payload'] + '&jb={}'.format(jb),
            )

            self.add_request(response,
                             payloads=[
                                 TMXPayload(
                                     key="jb",
                                     raw_payload=jb,
                                     decoded_payload=decoded_payload,
                                     json_payload=self.lsa_payload.get_required_device_data(self.device)
                                 )
                             ])

            return response.status_code == 204

    async def request_fp_clear_image(self):
        headers = self.headers.copy()
        tag_from = self.tags['embedded_img_online_metrix']
        index = tag_from.index('sac.d.aa.online-metrix.net')
        code = tag_from[index - 16:index]
        key = self.org_id + "/" + code + self.session_id

        headers['accept'] = "*/*, " + key

        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(self.tags["embedded_image_fp_clear_png"], headers=headers)

            self.add_request(response)

    async def request_to_iframes(self):
        urls = list(self.tags["online_metrix_iframe"])

        for url in urls:
            async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
                response = await client.get(url)
                self.add_request(response)

            if self.predefined_iframes and url in self.predefined_iframes:
                html = self.predefined_iframes[url]
            else:
                html = response.text

            iframe = IFrame(
                script=self.reveal_strings(BeautifulSoup(html, 'html.parser').find('script').text),
                device=self.device,
                session_id=self.session_id,
                cookie_jar=self.cookie_jar,
                headers=self.headers,
                proxy=self.proxy,
            )

            if iframe.tags.get('lsa_payload'):
                await self.send_lsb_payload(url=iframe.tags['lsa_payload'])
            elif iframe.tags.get('jwk_payload'):
                await self.send_jwk_payload(url=iframe.tags['jwk_payload'])

    async def request_to_online_matrix_image(self):
        async with httpx.AsyncClient(headers=self.headers, proxies=self.proxy, cookies=self.cookie_jar) as client:
            response = await client.get(self.tags["embedded_img_online_metrix"])

            self.add_request(response)
