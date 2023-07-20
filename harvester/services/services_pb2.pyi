from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ScriptType(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = []
    PROFILING: _ClassVar[ScriptType]
    MAIN: _ClassVar[ScriptType]
PROFILING: ScriptType
MAIN: ScriptType

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

class LinkURLsMessage(_message.Message):
    __slots__ = ["script", "script_type"]
    SCRIPT_FIELD_NUMBER: _ClassVar[int]
    SCRIPT_TYPE_FIELD_NUMBER: _ClassVar[int]
    script: str
    script_type: ScriptType
    def __init__(self, script: _Optional[str] = ..., script_type: _Optional[_Union[ScriptType, str]] = ...) -> None: ...

class ListOfURLs(_message.Message):
    __slots__ = ["urls"]
    URLS_FIELD_NUMBER: _ClassVar[int]
    urls: _containers.RepeatedScalarFieldContainer[str]
    def __init__(self, urls: _Optional[_Iterable[str]] = ...) -> None: ...

class LinkURLsResponse(_message.Message):
    __slots__ = ["urls", "script_type", "error"]
    class UrlsEntry(_message.Message):
        __slots__ = ["key", "value"]
        KEY_FIELD_NUMBER: _ClassVar[int]
        VALUE_FIELD_NUMBER: _ClassVar[int]
        key: str
        value: ListOfURLs
        def __init__(self, key: _Optional[str] = ..., value: _Optional[_Union[ListOfURLs, _Mapping]] = ...) -> None: ...
    URLS_FIELD_NUMBER: _ClassVar[int]
    SCRIPT_TYPE_FIELD_NUMBER: _ClassVar[int]
    ERROR_FIELD_NUMBER: _ClassVar[int]
    urls: _containers.MessageMap[str, ListOfURLs]
    script_type: ScriptType
    error: str
    def __init__(self, urls: _Optional[_Mapping[str, ListOfURLs]] = ..., script_type: _Optional[_Union[ScriptType, str]] = ..., error: _Optional[str] = ...) -> None: ...
