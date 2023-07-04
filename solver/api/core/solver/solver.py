import requests
from .exceptions import InvalidURLException
import esprima

#: wallyworld, direct link to the script
#: https://i5.walmartimages.com/dfw/4ff9c6c9-d9a0/k2-_66e7fff8-b096-45d0-8ec5-70e5787386e9.v1.js

#: bestbuy, needs parsing
#: https://www.bestbuy.com/~assets/bby/_com/sc-react-sign-on/dist/vendors/vendors-common-23edf61ca895851026cf0690000066dc.js

#: home depot, needs parsing
#: https://assets.thdstatic.com/account_lib/0.14.0/build/js/accountlib.min.js

#: ebay, needs parsing, no other anti-bots
#: https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&ru=https%3A%2F%2Fwww.ebay.com%2F


def validate_js_file(data: str):
    #: run initial parser to get initial proper js portion

    try:
        program = esprima.parseScript(data)
    except Exception as e:
        raise InvalidURLException("The script is not valid JavaScript. {}".format(e))

