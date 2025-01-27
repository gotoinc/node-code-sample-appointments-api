import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse } from 'src/common/service-response';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { CreateUserDto } from './dto/create-user.dto';

export class UsersService implements IUsersService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly rolesService: IRolesService,
  ) {}

  async create(user: CreateUserDto): Promise<IServiceResponse<User>> {
    try {
      const { error: errorRole, data: role } =
        await this.rolesService.findByName(user.role);

      if (!role || errorRole) {
        return { error: errorRole, data: null };
      }

      const userEntity: UserEntity = {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: role.id,
      };

      const createdUser = await this.usersRepository.create(userEntity);

      return { error: null, data: createdUser };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error creating user' }, data: null };
    }
  }

  async findOne(
    email: string,
  ): Promise<IServiceResponse<User & { user_role: UserRole }>> {
    try {
      const user = await this.usersRepository.findOne(email);

      if (!user) {
        return { error: null, data: null };
      }

      return { error: null, data: user };
    } catch (error) {
      console.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async getUsers(): Promise<IServiceResponse<User[]>> {
    try {
      const users: User[] = await this.usersRepository.findAll();

      return { error: null, data: users };
    } catch (error) {
      console.error(error);
      return { error: { message: error.message }, data: null };
    }
  }
}
