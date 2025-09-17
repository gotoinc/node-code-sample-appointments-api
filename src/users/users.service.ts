import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IEmailCredentialsRepository } from 'src/iam/authentication/email-credentials/email-credentials.repository.interface';

export class UsersService implements IUsersService {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly rolesService: IRolesService,
    private readonly emailCredentialRepository: IEmailCredentialsRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async create(user: CreateUserDto): Promise<IServiceResponse<User>> {
    try {
      const { error: errorRole, data: role } =
        await this.rolesService.findByName(user.role);

      if (errorRole) return { error: errorRole, data: null };
      if (!role) return ServiceResponse.notFound('Role not found');

      const userEntity: UserEntity = {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: role.id,
      };

      const createdUser = await this.usersRepository.create(userEntity);

      return ServiceResponse.success<User>(createdUser);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error creating user' }, data: null };
    }
  }

  async findOne(
    email: string,
  ): Promise<IServiceResponse<User & { user_role: UserRole }>> {
    try {
      const user = await this.usersRepository.findOne(email);

      if (!user) return { error: null, data: null };

      return ServiceResponse.success<User & { user_role: UserRole }>(user);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<User[]>> {
    try {
      const users: User[] = await this.usersRepository.findAll();

      return ServiceResponse.success<User[]>(users);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IServiceResponse<User>> {
    try {
      if (updateUserDto.email) {
        const currentUser = await this.usersRepository.findById(id);
        const curentUserCredentials =
          await this.emailCredentialRepository.findOne(
            currentUser?.email || '',
          );

        if (!currentUser || !curentUserCredentials) {
          return ServiceResponse.notFound('User not found');
        }

        const existingUser = await this.usersRepository.findOne(
          updateUserDto.email,
        );

        const existedUserCredentials =
          await this.emailCredentialRepository.findOne(updateUserDto.email);

        if (
          (existingUser && existingUser.id !== id) ||
          (existedUserCredentials && existedUserCredentials.user_id !== id)
        ) {
          return ServiceResponse.conflict('Email already in use');
        }

        const updatedEmail = await this.transactionManager.transaction(
          async (tx) => {
            await this.emailCredentialRepository.updateEmail(
              currentUser.email,
              updateUserDto.email!,
            );

            const upd = await this.usersRepository.update(
              id,
              updateUserDto,
              tx,
            );

            return upd;
          },
        );

        return ServiceResponse.success<User>(updatedEmail);
      } else {
        const updatedUser = await this.usersRepository.update(
          id,
          updateUserDto,
        );
        return ServiceResponse.success<User>(updatedUser);
      }
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async remove(id: number, email: string): Promise<IServiceResponse<User>> {
    try {
      const user = await this.usersRepository.findOne(email);
      if (!user) return ServiceResponse.notFound('User not found');

      await this.usersRepository.remove(id);
      return ServiceResponse.success<User>(user);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }
}
