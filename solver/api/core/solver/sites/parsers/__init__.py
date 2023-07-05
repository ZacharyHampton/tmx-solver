import requests
from ...exceptions import FailedToRetrieveScriptException


class Site:
    def __init__(
            self,
            site_name: str,
            site_domain: str,
            config_url: str,
            tmx_hostname: str,
            org_id: str,
            headers: dict = None,
            needs_parsing: bool = False,
    ):
        self.site_name = site_name
        self.site_domain = site_domain
        self.config_url = config_url
        self.headers = headers
        self.needs_parsing = needs_parsing

        #: params for tmx profiling url

        """
        How the tmx initial profiling url works:
        
        "https://<tmx_hostname>/<random string>.js?<params>"
        
        params tend to be:
        key: random string
        values:
        org_id
        session_id
        some other value (character
        """

        self.tmx_hostname = tmx_hostname
        self.org_id = org_id

    def parse(self, data: str) -> str: ...

    def get_config_script(self):
        if self.headers is not None:
            response = requests.get(self.config_url, headers=self.headers)
        else:
            response = requests.get(self.config_url)

        if response.status_code != 200:
            raise FailedToRetrieveScriptException(f'Failed to retrieve script from {self.config_url}')

        if self.needs_parsing:
            return self.parse(response.text)
        else:
            return response.text



