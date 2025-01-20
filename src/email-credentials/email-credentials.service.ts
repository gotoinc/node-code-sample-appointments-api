import { EmailCredentials, User } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response.interface';
import { IRolesRepository } from 'src/roles/roles.repository.interface';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { IEmailCredentialsRepository } from 'src/email-credentials/email-credentials.repository.interface';
import { ITransactionManager } from 'src/interfaces/transaction-manager.interface';

export class EmailCredentialsService {
  constructor(
    private readonly transactionManager: ITransactionManager,
    private readonly userRepository: IUsersRepository,
    private readonly emailCredentialsRepository: IEmailCredentialsRepository,
    private readonly roleRepository: IRolesRepository,
  ) {}

  async createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
    hashedPassword: string,
  ): Promise<IServiceResponse<User>> {
    try {
      const user = await this.transactionManager.transaction(async (tx) => {
        const role = await this.roleRepository.findByName(roleName, tx);
        if (!role) {
          throw new Error(`Role ${roleName} not found`);
        }

        const user = await this.userRepository.create(
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

      return { error: null, data: user };
    } catch (error) {
      return { error: { message: error.message }, data: null };
    }
  }

  async findOne(email: string): Promise<IServiceResponse<EmailCredentials>> {
    try {
      const emailCredentials =
        await this.emailCredentialsRepository.findOne(email);

      if (!emailCredentials) {
        return { error: null, data: null };
      }

      return { error: null, data: emailCredentials };
    } catch (error) {
      console.error(error);
      return { error: { message: error.message }, data: null };
    }
  }
}
