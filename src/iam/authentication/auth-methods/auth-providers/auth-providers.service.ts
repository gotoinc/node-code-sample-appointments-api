import { AuthProvider } from '@prisma/client';
import { IServiceResponse } from 'src/common/interfaces/service-response.interface';
import { IAuthProvidersRepository } from './auth-providers.repository.interface';
import { IAuthProvidersService } from './auth-providers.service.interface';

export class AuthProvidersService implements IAuthProvidersService {
  constructor(
    private readonly authProvidersRepository: IAuthProvidersRepository,
  ) {}

  async findOne(
    authProviderName: string,
  ): Promise<IServiceResponse<AuthProvider>> {
    try {
      const authProvider: AuthProvider =
        await this.authProvidersRepository.findOne(authProviderName);

      if (!authProvider)
        return { error: { message: 'Auth provider not found' }, data: null };

      return { error: null, data: authProvider };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding auth provider' }, data: null };
    }
  }

  async create(
    authProviderName: string,
  ): Promise<IServiceResponse<AuthProvider>> {
    try {
      const authProvider: AuthProvider =
        await this.authProvidersRepository.create(authProviderName);

      return { error: null, data: authProvider };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error creating auth provider' }, data: null };
    }
  }
}
