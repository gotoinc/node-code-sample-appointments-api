import { EmailCredentials, User } from '@prisma/client';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { IEmailCredentialsRepository } from 'src/iam/authentication/email-credentials/email-credentials.repository.interface';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IEmailCredentialsService } from './email-credentials.service.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';

export class EmailCredentialsService implements IEmailCredentialsService {
  constructor(
    private readonly logger: ILogger,
    private readonly transactionManager: ITransactionManager,
    private readonly usersRepository: IUsersRepository,
    private readonly emailCredentialsRepository: IEmailCredentialsRepository,
    private readonly rolesService: IRolesService,
  ) {}

  async createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
    hashedPassword: string,
  ): Promise<IServiceResponse<User>> {
    try {
      const { error: errorRole, data: role } =
        await this.rolesService.findByName(roleName);

      if (errorRole || !role) return { error: errorRole, data: null };

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

        await this.emailCredentialsRepository.create(
          {
            email: user.email,
            passwordHash: hashedPassword,
            userId: user.id,
          },
          tx,
        );

        return user;
      });

      return ServiceResponse.success<User>(user);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findOne(email: string): Promise<IServiceResponse<EmailCredentials>> {
    try {
      const emailCredentials =
        await this.emailCredentialsRepository.findOne(email);

      if (!emailCredentials) return ServiceResponse.notFound('Email not found');

      return ServiceResponse.success<EmailCredentials>(emailCredentials);
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error finding email credentials' },
        data: null,
      };
    }
  }

  async updatePassword(
    email: string,
    hashedPassword: string,
  ): Promise<IServiceResponse<EmailCredentials>> {
    try {
      const emailCredentials =
        await this.emailCredentialsRepository.findOne(email);

      if (!emailCredentials) return ServiceResponse.notFound('Email not found');

      await this.emailCredentialsRepository.updatePassword(
        email,
        hashedPassword,
      );

      return ServiceResponse.success<EmailCredentials>(emailCredentials);
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Error updating password' },
        data: null,
      };
    }
  }
}
