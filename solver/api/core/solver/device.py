from dataclasses import dataclass
from ..db import get_client
from urllib import parse


@dataclass
class Device:
    data: dict


def _convert_query_string_to_dict(query_string):
    return dict(parse.parse_qsl(query_string))


def get_devices():
    db = get_client()["harvester"]
    payloads_collection = db["payloads"]

    pipeline = [
        {"$group": {"_id": "$thx_guid", "payloads": {"$push": "$$ROOT"}}},
        {"$sort": {"payloads.timestamp": 1}},
        #: filter where "jsou" in decoded_parameter_valie
        {"$match": {"payloads.parameters.jb.decoded_parameter_value": {"$regex": ".*jsou.*"}}},
        {"$project": {"payloads": {"$slice": ["$payloads", 1]}}}
    ]

    cursor = payloads_collection.aggregate(pipeline)
    payloads = [_convert_query_string_to_dict(payload['payloads'][0]['parameters']['jb']['decoded_parameter_value']) for
                payload in cursor]
    payloads = [Device(data=payload) for payload in payloads if 'jsou' in payload]

    return payloads
