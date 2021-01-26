import {grpc} from '@improbable-eng/grpc-web';
import {ProtobufMessage} from '@improbable-eng/grpc-web/dist/typings/message';
import {UnaryMethodDefinition} from '@improbable-eng/grpc-web/dist/typings/service';
import {TransportFactory} from '@improbable-eng/grpc-web/dist/typings/transports/Transport';
import {Observable} from 'rxjs';
import TransportHelper from '../utils';

/**
 * Core GRPC Service
 */
export default class GrpcService {
  /**
   * GRPC Web Service Endpoint
   */
  private host: string;
  /*
   * Transport factory
   */
  private transport: TransportFactory;
  /**
   *
   * @param host GRPC Web Service Endpoint
   * @param transport Set a custom transport factory or leave empty for default
   */
  constructor(host: string, transport?: TransportFactory) {
    this.host = host;
    this.transport = TransportHelper.getTransportFactory(transport);
  }

  callUnary<
    TRequest extends ProtobufMessage,
    TResponse extends ProtobufMessage,
    M extends UnaryMethodDefinition<TRequest, TResponse>
  >(methodDescriptor: M, request: TRequest): Observable<TResponse> {
    return new Observable(observer => {
      const call = grpc.unary(methodDescriptor, {
        request: request,
        host: this.host,
        transport: this.transport,
        onEnd: response => {
          const {status, statusMessage, message} = response;
          if (status === grpc.Code.OK && message) {
            observer.next(message as TResponse);
          } else {
            observer.error({
              code: status,
              statusMessage: statusMessage,
            });
          }
        },
      });
      return {
        unsubscribe() {
          const aaaa = 5;
          call.close();
        },
      };
    });
  }

  callStream<
    TRequest extends ProtobufMessage,
    TResponse extends ProtobufMessage,
    M extends UnaryMethodDefinition<TRequest, TResponse>
  >(methodDescriptor: M, request: TRequest): Observable<TResponse> {
    return new Observable(observer => {
      const call = grpc.invoke(methodDescriptor, {
        request: request,
        host: this.host,
        transport: this.transport,
        onMessage: response => {
          observer.next(response.toObject() as TResponse);
        },
        onEnd: () => {
          observer.complete();
        },
      });
      return {
        unsubscribe() {
          call.close();
        },
      };
    });
  }
}
