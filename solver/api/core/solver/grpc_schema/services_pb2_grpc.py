# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

from . import services_pb2 as services__pb2


class TransformationServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Transform = channel.unary_unary(
                '/TransformationService/Transform',
                request_serializer=services__pb2.TransformationMessage.SerializeToString,
                response_deserializer=services__pb2.TransformationMessage.FromString,
                )
        self.CreateURLVM = channel.unary_unary(
                '/TransformationService/CreateURLVM',
                request_serializer=services__pb2.CreateURLVMMessage.SerializeToString,
                response_deserializer=services__pb2.CreateURLVMResponse.FromString,
                )


class TransformationServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def Transform(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def CreateURLVM(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_TransformationServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Transform': grpc.unary_unary_rpc_method_handler(
                    servicer.Transform,
                    request_deserializer=services__pb2.TransformationMessage.FromString,
                    response_serializer=services__pb2.TransformationMessage.SerializeToString,
            ),
            'CreateURLVM': grpc.unary_unary_rpc_method_handler(
                    servicer.CreateURLVM,
                    request_deserializer=services__pb2.CreateURLVMMessage.FromString,
                    response_serializer=services__pb2.CreateURLVMResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'TransformationService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class TransformationService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def Transform(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/TransformationService/Transform',
            services__pb2.TransformationMessage.SerializeToString,
            services__pb2.TransformationMessage.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def CreateURLVM(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/TransformationService/CreateURLVM',
            services__pb2.CreateURLVMMessage.SerializeToString,
            services__pb2.CreateURLVMResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)


class LinkingServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.LinkURLs = channel.unary_unary(
                '/LinkingService/LinkURLs',
                request_serializer=services__pb2.LinkURLsMessage.SerializeToString,
                response_deserializer=services__pb2.LinkURLsResponse.FromString,
                )


class LinkingServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def LinkURLs(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_LinkingServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'LinkURLs': grpc.unary_unary_rpc_method_handler(
                    servicer.LinkURLs,
                    request_deserializer=services__pb2.LinkURLsMessage.FromString,
                    response_serializer=services__pb2.LinkURLsResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'LinkingService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class LinkingService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def LinkURLs(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/LinkingService/LinkURLs',
            services__pb2.LinkURLsMessage.SerializeToString,
            services__pb2.LinkURLsResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
