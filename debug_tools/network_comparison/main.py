import re
import time

from seleniumwire.inspect import TimeoutException
import seleniumwire.undetected_chromedriver as uc
from solver.api.core.solver.sites import site_list
from solver.api.core.solver.solver import TMXRequest
from pydantic import BaseModel
from dataclasses import field
from argparse import ArgumentParser


class BrowserResponse(BaseModel):
    profiling_script: str
    main_script: str
    session_id: str
    requests: list[TMXRequest] = field(default_factory=list)


def get_browser_network_requests(url: str) -> BrowserResponse:
    chrome_options = uc.ChromeOptions()
    chrome_options.add_argument("--auto-open-devtools-for-tabs")

    driver = uc.Chrome(headless=True, use_subprocess=False, options=chrome_options)

    response = BrowserResponse()
    tmx_regex = r''

    def interceptor(request):
        def bundle_request() -> TMXRequest: ...
        if "/fp/clear.png" in request.url or re.match(tmx_regex, request.url):
            #: ifs for getting main or profiling script & fetching session_id

            response.requests += bundle_request()

    driver.request_interceptor = interceptor

    driver.get(url)

    time.sleep(5)

    while True:
        try:
            driver.wait_for_request(tmx_regex, timeout=10)
        except TimeoutException:
            break

    return response


def get_solver_network_requests(profiling_script: str, main_script: str, session_id: str) -> list[TMXRequest]: ...


def transform_requests(browser_requests: list[TMXRequest], solver_requests: list[TMXRequest]):
    requests = {}

    def transform_by_type(from_type: str):
        variable = {
            "solver": solver_requests,
            "browser": browser_requests
        }

        for request in variable[from_type]:
            if not requests[request.url][from_type]:  #: may need to use .get
                requests[request.url][from_type] = [request]
            else:
                requests[request.url][from_type].append(request)

    transform_by_type("browser")
    transform_by_type("solver")

    return requests


def main():
    parser = ArgumentParser(description='Comparison CLI for ThreatMatrix solver.')
    parser.add_argument('domain', help='Domain to be tested with.')
    parser.add_argument('url', help='URL where you want to solve TMX.')

    args = parser.parse_args()
    site = site_list[args.domain]

    browser_response = get_browser_network_requests(args.url)
    solver_requests = get_solver_network_requests(
        profiling_script=browser_response.profiling_script,
        main_script=browser_response.main_script,
        session_id=browser_response.session_id
    )

    requests = transform_requests(
        browser_requests=browser_response.requests,
        solver_requests=solver_requests
    )


if __name__ == "__main__":
    main()
