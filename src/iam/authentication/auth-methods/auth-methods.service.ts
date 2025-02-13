import { UserAuthMethod } from '@prisma/client';
import { IAuthMethodsService } from './auth-methods.service.interface';
import { IAuthMethodsRepository } from './auth-methods.repository.interface';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IAuthProvidersService } from './auth-providers/auth-providers.service.interface';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IRolesService } from 'src/roles/roles.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';

export class AuthMethodsService implements IAuthMethodsService {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionManager: ITransactionManager,
    private readonly rolesService: IRolesService,
    private readonly usersRepository: IUsersRepository,
    private readonly authMethodsRepository: IAuthMethodsRepository,
    private readonly authProvidersService: IAuthProvidersService,
  ) {}

  async createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
    providerName: string,
  ): Promise<IServiceResponse<UserAuthMethod>> {
    const { error: errorRole, data: role } =
      await this.rolesService.findByName(roleName);

    if (errorRole || !role) return { error: errorRole, data: null };

    const { error: errorAuthProvider, data: authProvider } =
      await this.authProvidersService.findOne(providerName);

    if (errorAuthProvider || !authProvider)
      return { error: errorAuthProvider, data: null };

    try {
      const user = await this.transactionManager.transaction(async (tx) => {
        const user = await this.usersRepository.create(
          {
            email,
            firstName,
            lastName,
            roleId: role.id,
          },
          tx,
        );

        const userAuthMethod = await this.authMethodsRepository.create(
          {
            email: user.email,
            userId: user.id,
            authProviderId: authProvider.id,
          },
          tx,
        );

        return userAuthMethod;
      });

      return ServiceResponse.success<UserAuthMethod>(user);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error creating user' }, data: null };
    }
  }

  async findOne(email: string): Promise<IServiceResponse<UserAuthMethod>> {
    try {
      const userAuthMethod = await this.authMethodsRepository.findOne(email);

      if (!userAuthMethod) return { error: null, data: null };

      return ServiceResponse.success<UserAuthMethod>(userAuthMethod);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error finding user' }, data: null };
    }
  }
}
