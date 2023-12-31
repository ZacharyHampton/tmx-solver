import re
import time

import seleniumwire.undetected_chromedriver as uc
from solver.api.core.solver.sites import site_list
from solver.api.core.solver.sites.parsers import Site
from solver.api.core.solver.solvers.solver import TMXRequest, TMXPayload
from solver.api.core.solver.device import get_devices
from pydantic import BaseModel
from dataclasses import field
from urllib.parse import parse_qsl
from seleniumwire.utils import decode as selenium_decode
import pytest


def decrypt(encrypted_string, session_id):
    try:
        td_D = "0123456789abcdef"
        td_G = ""
        for td_g in range(0, len(encrypted_string), 2):
            td_E = (td_D.index(encrypted_string[td_g]) << 4) | td_D.index(encrypted_string[td_g + 1])
            td_T = ord(session_id[td_g // 2 % len(session_id)]) & 10
            td_G += chr(td_E ^ td_T)
        td_U_length = int(td_G.split("&")[0])
        td_U = td_G[td_G.index("&") + 1: td_U_length + td_G.index("&") + 1]
        return td_U
    except Exception:
        return None


class BrowserResponse(BaseModel):
    profiling_script: str = None
    main_script: str = None
    iframes: dict[str, str]
    session_id: str = None
    requests: list[TMXRequest] = field(default_factory=list)


def get_browser_network_requests(url: str) -> BrowserResponse:
    chrome_options = uc.ChromeOptions()
    chrome_options.add_argument("--auto-open-devtools-for-tabs")

    driver = uc.Chrome(headless=True, use_subprocess=False, options=chrome_options)

    browser_response = BrowserResponse(requests=[], iframes={})
    tmx_regex = r".*\?[a-z0-9_]{16}=.*"
    found_main_script = False

    def interceptor(request, response):
        nonlocal found_main_script

        def bundle_request() -> TMXRequest:
            payloads = []

            query = parse_qsl(request.querystring)
            for key, value in query:
                #: if key and value are hexadecimal strings of any length
                if all(c in "0123456789abcdef" for c in value):
                    payloads.append(TMXPayload(
                        key=key,
                        raw_payload=value,
                        decoded_payload=(decoded_payload := decrypt(value, browser_response.session_id)),
                        json_payload=dict(parse_qsl(decoded_payload))
                    ))

            return TMXRequest(
                method=request.method,
                url=request.url.split("?")[0],
                headers=dict(request.headers),
                payloads=payloads
            )

        #: ifs for getting main or profiling script & fetching session_id
        if "/fp/clear.png" in request.url or re.match(tmx_regex, request.url):
            if response.body:
                if ".js" in request.path:  #: profiling script
                    query_string = parse_qsl(request.querystring)
                    browser_response.session_id = query_string[1][1]
                    browser_response.profiling_script = selenium_decode(
                        response.body,
                        response.headers.get('Content-Encoding', 'identity')
                    ).decode('utf-8')
                elif (
                        response.headers.get('Content-Type') == "text/javascript;charset=UTF-8" and
                        not found_main_script and
                        response.status_code == 200
                ):  #: main script
                    browser_response.main_script = selenium_decode(
                        response.body,
                        response.headers.get('Content-Encoding', 'identity')
                    ).decode('utf-8')
                    found_main_script = True
                elif (
                        '<script type="text/javascript">' in
                        (iframe_script := selenium_decode(
                            response.body,
                            response.headers.get('Content-Encoding', 'identity')
                        ).decode('utf-8', errors='ignore'))  #: be careful, does not raise exception on decode error
                ):  #: requests
                    browser_response.iframes[request.url] = iframe_script

            bundled_request = bundle_request()
            browser_response.requests.append(bundled_request)

    driver.response_interceptor = interceptor
    driver.scopes = [
        tmx_regex,
        "/fp/clear.png"
    ]

    driver.get(url)

    time.sleep(20)

    """while True:
        try:
            driver.wait_for_request(tmx_regex, timeout=10)
        except TimeoutException:
            break"""

    return browser_response


def get_solver_network_requests(
        profiling_script: str,
        main_script: str,
        iframes: dict[str, str],
        session_id: str,
        site: Site,
        url: str,
) -> list[TMXRequest]:
    working_device = site.get_testing_device(get_devices())

    success, requests = site.solve(
        session_id=session_id,
        device=working_device,
        url=url,
        predefined_script=True,
        profiling_script=profiling_script,
        main_script=main_script,
        iframes=iframes
    )

    return requests


def transform_requests(browser_requests: list[TMXRequest], solver_requests: list[TMXRequest]):
    requests = {}

    def transform_by_type(from_type: str):
        variable = {
            "solver": solver_requests,
            "browser": browser_requests
        }

        """
        Sort by url, then by from_type, add to list
        """

        for request in variable[from_type]:
            if request.url not in requests:
                requests[request.url] = {}

            if from_type not in requests[request.url]:
                requests[request.url][from_type] = []

            requests[request.url][from_type].append(request)

    transform_by_type("browser")
    transform_by_type("solver")

    return requests


@pytest.mark.parametrize("domain,url", [
    ("homedepot.com", "https://www.homedepot.com/auth/view/signin?redirect=/login&ref=null")
])
def test_requests_comparison(domain, url):
    site = site_list[domain]

    browser_response = get_browser_network_requests(url)
    solver_requests = get_solver_network_requests(
        profiling_script=browser_response.profiling_script,
        main_script=browser_response.main_script,
        iframes=browser_response.iframes,
        session_id=browser_response.session_id,
        site=site,
        url=url
    )

    #: for debugging
    revealed_profiling_script = site.reveal_strings(browser_response.profiling_script)
    revealed_main_script = site.reveal_strings(browser_response.main_script)

    requests = transform_requests(
        browser_requests=browser_response.requests,
        solver_requests=solver_requests
    )

    for url in requests:
        if '.js' in url:
            continue

        assert len(requests[url]) == 2  #: the solver and browser are both making requests

        assert len(requests[url]['browser']) == len(
            requests[url]['solver'])  #: the same amount of requests are being made
