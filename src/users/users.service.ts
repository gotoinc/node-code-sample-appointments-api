import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ILogger } from 'src/common/interfaces/logger.interface';

export class UsersService implements IUsersService {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly rolesService: IRolesService,
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
}
