from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class TransformationMessage(_message.Message):
    __slots__ = ["script", "fast", "error"]
    SCRIPT_FIELD_NUMBER: _ClassVar[int]
    FAST_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    script: str
    fast: bool
    error: str
    def __init__(self, script: _Optional[str] = ..., fast: bool = ..., error: _Optional[str] = ...) -> None: ...

class CreateURLVMMessage(_message.Message):
    __slots__ = ["script", "hostname", "params"]
    SCRIPT_FIELD_NUMBER: _ClassVar[int]
    HOSTNAME_FIELD_NUMBER: _ClassVar[int]
    PARAMS_FIELD_NUMBER: _ClassVar[int]
    script: str
    hostname: str
    params: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, script: _Optional[str] = ..., hostname: _Optional[str] = ..., params: _Optional[_Iterable[str]] = ...) -> None: ...

class CreateURLVMResponse(_message.Message):
    __slots__ = ["url", "error"]
    URL_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    url: str
    error: str
    def __init__(self, url: _Optional[str] = ..., error: _Optional[str] = ...) -> None: ...
