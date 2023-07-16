from . import Site
from bs4 import BeautifulSoup


class EBay(Site):
    def __init__(self):
        super().__init__(
            site_name="eBay",
            site_domain="ebay.com",
            config_url="https://pages.ebay.com/identity/device/t_n6.html",
            headers={
                'authority': 'signin.ebay.com',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'referer': 'https://www.ebay.com/',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-full-version': '"112.0.5615.49"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-model': '""',
                'sec-ch-ua-platform': '"macOS"',
                'sec-ch-ua-platform-version': '"12.4.0"',
                'sec-fetch-dest': 'document',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-site': 'same-site',
                'sec-fetch-user': '?1',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            },
            needs_parsing=True,
            tmx_hostname='src.ebay-us.com',
            org_id='usllpic0',
        )

        #: 280fdf771890a9f0bb8044bfffffe30c session_id example
        #: 6 page_id example

    def parse(self, response: str) -> str:
        return BeautifulSoup(response, 'html.parser').find('script').string
