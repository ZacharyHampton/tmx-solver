from . import Site
import esprima

class EBay(Site):
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
        ast = esprima.parseScript(response)


