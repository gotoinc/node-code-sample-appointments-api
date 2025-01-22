import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse } from 'src/common/service-response.interface';

export const UsersServiceSymbol = Symbol('USERS_SERVICE');

export interface IUsersService {
  create(user: Omit<UserEntity, 'password'>): Promise<IServiceResponse<User>>;

  findOne(
    email: string,
  ): Promise<IServiceResponse<User & { user_role: UserRole }>>;

  getUsers(): Promise<IServiceResponse<User[]>>;
}
