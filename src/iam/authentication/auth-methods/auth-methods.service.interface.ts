import { UserAuthMethod } from '@prisma/client';
import { IServiceResponse } from 'src/common/interfaces/service-response.interface';

export const AuthMethodsServiceSymbol = Symbol('AUTH_METHODS_SERVICE');

export interface IAuthMethodsService {
  createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
    providerName: string,
  ): Promise<IServiceResponse<UserAuthMethod>>;

  findOne(email: string): Promise<IServiceResponse<UserAuthMethod>>;
}
