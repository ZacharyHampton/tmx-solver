from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class TransformationMessage(_message.Message):
    __slots__ = ["script", "error"]
    SCRIPT_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    script: str
    error: str
    def __init__(self, script: _Optional[str] = ..., error: _Optional[str] = ...) -> None: ...
