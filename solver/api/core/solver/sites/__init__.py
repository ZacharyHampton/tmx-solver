from .parsers.ebay import EBay
from .parsers.home_depot import HomeDepot

site_list = {
    "ebay.com": EBay(),
    "homedepot.com": HomeDepot(),
}
