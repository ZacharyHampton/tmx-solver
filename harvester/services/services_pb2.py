# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: services.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x0eservices.proto\"a\n\x15TransformationMessage\x12\x0e\n\x06script\x18\x01 \x01(\t\x12\x11\n\x04\x66\x61st\x18\x02 \x01(\x08H\x00\x88\x01\x01\x12\x12\n\x05\x65rror\x18\x03 \x01(\tH\x01\x88\x01\x01\x42\x07\n\x05_fastB\x08\n\x06_error\"F\n\x12\x43reateURLVMMessage\x12\x0e\n\x06script\x18\x01 \x01(\t\x12\x10\n\x08hostname\x18\x02 \x01(\t\x12\x0e\n\x06params\x18\x03 \x03(\t\"@\n\x13\x43reateURLVMResponse\x12\x0b\n\x03url\x18\x01 \x01(\t\x12\x12\n\x05\x65rror\x18\x02 \x01(\tH\x00\x88\x01\x01\x42\x08\n\x06_error2\x8e\x01\n\x15TransformationService\x12;\n\tTransform\x12\x16.TransformationMessage\x1a\x16.TransformationMessage\x12\x38\n\x0b\x43reateURLVM\x12\x13.CreateURLVMMessage\x1a\x14.CreateURLVMResponseb\x06proto3')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'services_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_TRANSFORMATIONMESSAGE']._serialized_start=18
  _globals['_TRANSFORMATIONMESSAGE']._serialized_end=115
  _globals['_CREATEURLVMMESSAGE']._serialized_start=117
  _globals['_CREATEURLVMMESSAGE']._serialized_end=187
  _globals['_CREATEURLVMRESPONSE']._serialized_start=189
  _globals['_CREATEURLVMRESPONSE']._serialized_end=253
  _globals['_TRANSFORMATIONSERVICE']._serialized_start=256
  _globals['_TRANSFORMATIONSERVICE']._serialized_end=398
# @@protoc_insertion_point(module_scope)