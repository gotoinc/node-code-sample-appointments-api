import { User, UserRole } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateUserDto } from './dto/create-user.dto';

export const UsersServiceSymbol = Symbol('USERS_SERVICE');

export interface IUsersService {
  create(user: CreateUserDto): Promise<IServiceResponse<User>>;

  findOne(
    email: string,
  ): Promise<IServiceResponse<User & { user_role: UserRole }>>;

  getUsers(): Promise<IServiceResponse<User[]>>;
}
