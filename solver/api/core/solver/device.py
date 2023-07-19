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
        {"$group": {"_id": "$session_id", "payloads": {"$push": "$$ROOT"}}},
        {"$sort": {"payloads.timestamp": 1}},
    ]

    cursor = payloads_collection.aggregate(pipeline)

    sessions = [payload['payloads'] for payload in cursor if len(payload['payloads']) > 1]

    device_dicts = []

    for session in sessions:
        session_dict = {}

        for payload in session:
            for parameter in payload['parameters']:
                if payload['parameters'][parameter].get('decoded_parameter_value') is not None:
                    session_dict = session_dict | _convert_query_string_to_dict(
                        payload['parameters'][parameter]['decoded_parameter_value']
                    )

        if session_dict:
            device_dicts.append(session_dict)

    payloads = [Device(data=device) for device in device_dicts]

    return payloads
