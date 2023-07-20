from dataclasses import dataclass
from urllib.parse import quote
from .device import Device
from dataclasses import field
import json


@dataclass
class Payload:
    required_fields: list[str]
    optional_fields: list[str] = field(default_factory=list)

    @staticmethod
    def json_to_query_string(json_data: dict, include_ampersand: bool = True) -> str:
        placeholder = ""

        for key, value in json_data.items():
            if include_ampersand:
                placeholder += "&"

            placeholder += f"{key}={quote(value)}"

        return placeholder

    def get_required_device_data(self, device: Device):
        fields = self.required_fields + self.optional_fields

        return {
            data_field: json.dumps(device.data[data_field]) if type(device.data[data_field]) is dict else device.data[data_field]
            for data_field in fields
            if device.data.get(data_field) is not None
        }

    def get_query_string(self, device: Device, include_ampersand: bool = True) -> str:
        return self.json_to_query_string(self.get_required_device_data(device), include_ampersand=include_ampersand)
