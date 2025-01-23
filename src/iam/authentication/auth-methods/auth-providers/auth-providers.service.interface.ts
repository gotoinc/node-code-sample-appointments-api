import { AuthProvider } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response.interface';

export const AuthProvidersServiceSymbol = Symbol('AUTH_PROVIDERS_SERVICE');

export interface IAuthProvidersService {
  findOne(authProviderName: string): Promise<IServiceResponse<AuthProvider>>;
  create(authProviderName: string): Promise<IServiceResponse<AuthProvider>>;
}
