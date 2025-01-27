export const ResponseStatus = {
  NotFound: 'NOT_FOUND',
  Forbidden: 'FORBIDDEN',
  Conflict: 'CONFLICT',
} as const;

export type ErrorResponseStatus =
  (typeof ResponseStatus)[keyof typeof ResponseStatus];

export interface IServiceResponse<T> {
  data: T | null;
  error: {
    message: string;
    status: ErrorResponseStatus;
  } | null;
}

export class ServiceResponse<T> implements IServiceResponse<T> {
  data: IServiceResponse<T>['data'];
  error: IServiceResponse<T>['error'];

  constructor(
    error: IServiceResponse<T>['error'] = null,
    data: IServiceResponse<T>['data'] = null,
  ) {
    this.error = error;
    this.data = data;
  }

  static success<T>(data: T): IServiceResponse<T> {
    return new ServiceResponse<T>(null, data);
  }

  static notFound(message: string = 'Not found'): ServiceResponse<null> {
    return new ServiceResponse(
      { message, status: ResponseStatus.NotFound },
      null,
    );
  }

  static forbidden(message: string = 'Forbidden'): ServiceResponse<null> {
    return new ServiceResponse(
      { message, status: ResponseStatus.Forbidden },
      null,
    );
  }

  static conflict(message: string = 'Conflict'): ServiceResponse<null> {
    return new ServiceResponse(
      { message, status: ResponseStatus.Conflict },
      null,
    );
  }
}
