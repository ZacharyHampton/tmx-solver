import random

from . import Site
import esprima
import uuid
import seleniumwire.undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import json
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ...device import Device, get_devices


class HomeDepot(Site):
    def __init__(self):
        super().__init__(
            site_name="Home Depot",
            site_domain="homedepot.com",
            config_url="https://assets.thdstatic.com/account_lib/0.14.0/build/js/accountlib.min.js",
            headers={
                'authority': 'www.homedepot.com',
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
            },
            needs_parsing=True,
            tmx_hostname='customer.homedepot.com',
            org_id='23o27znc',
        )

    def parse(self, response: str) -> str:
        ast = esprima.tokenize(response)

        for node in ast:
            if node.type == "String":
                if "var threatmetrix=threatmetrix" in node.value:
                    return node.value[1:-1]

    def generate_test_session_id(self) -> str:
        return str(uuid.uuid4())

    def test_solve(self, session_id: str, proxy: str = None) -> bool:
        working_device = Device({
          "jsou": "Mac",
          "jso": "Mac OS X 10_15_7",
          "jsbu": "Chrome",
          "jsb": "Chrome 114"
        })

        """random_device = random.choice(get_devices())
        if random_device is None:
            return False"""

        solve_success = self.solve(session_id, working_device, proxy=proxy)

        if not solve_success:
            return False

        return self.validate_session_id(session_id)

    @staticmethod
    def validate_session_id(session_id: str) -> bool:
        chrome_options = uc.ChromeOptions()
        chrome_options.add_argument("--auto-open-devtools-for-tabs")

        driver = uc.Chrome(headless=True, use_subprocess=False, options=chrome_options)

        def interceptor(request):
            if (
                    'customer/auth/v1/twostep/init' in request.path and
                    request.method == 'POST'
            ):
                body = json.loads(request.body.decode('utf-8'))
                body['sessionID'] = session_id
                request.body = json.dumps(body).encode('utf-8')

                del request.headers['Content-Length']
                request.headers['Content-Length'] = str(len(request.body))

        driver.request_interceptor = interceptor

        driver.get('https://www.homedepot.com/auth/view/signin?redirect=/&ref=null')

        #: wait for element to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'bttn__content'))
        )

        email_field = driver.find_element(value='username')
        email_field.send_keys('a@gmail.com')

        login_button = driver.find_elements(by=By.CLASS_NAME, value='bttn__content')[0]
        login_button.click()

        request = driver.wait_for_request('/customer/auth/v1/twostep/init', timeout=10)
        return '"tmx":false' in request.response.body.decode('utf-8') and request.response.status_code == 200


