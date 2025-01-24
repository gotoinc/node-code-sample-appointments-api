export class IServiceResponse<T> {
  data: T | null;
  error: { message: string; statusCode?: number } | null;
}
