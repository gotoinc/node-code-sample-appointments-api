import {
  ConflictException,
  ForbiddenException,
  HttpException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  ErrorResponseStatus,
  IServiceResponse,
  ResponseStatus,
} from './service-response';

export const mapResponseStatusToException: Record<
  ErrorResponseStatus,
  (...args: any[]) => HttpException
> = {
  [ResponseStatus.NotFound]: (...args: any[]) => new NotFoundException(...args),
  [ResponseStatus.Forbidden]: (...args: any[]) =>
    new ForbiddenException(...args),
  [ResponseStatus.Conflict]: (...args: any[]) => new ConflictException(...args),
};

export const handleServiceError = (
  error: IServiceResponse<any>['error'],
): HttpException => {
  if (error.status) {
    const exceptionFunction = mapResponseStatusToException[error.status];
    return exceptionFunction(error.message);
  }
  return new ServiceUnavailableException(error.message);
};
