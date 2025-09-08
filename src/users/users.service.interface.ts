import { User, UserRole } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreateUserDto } from './dto/create-user.dto';
import Multer from 'multer';

export const UsersServiceSymbol = Symbol('USERS_SERVICE');

export interface IUsersService {
  create(user: CreateUserDto): Promise<IServiceResponse<User>>;

  findOne(
    email: string,
  ): Promise<IServiceResponse<User & { user_role: UserRole }>>;

  findAll(): Promise<IServiceResponse<User[]>>;

  update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<IServiceResponse<User>>;

  remove(id: number, email: string): Promise<IServiceResponse<User>>;
  uploadAvatar(
    userId: number,
    file: Multer.File,
  ): Promise<IServiceResponse<string>>;
}
