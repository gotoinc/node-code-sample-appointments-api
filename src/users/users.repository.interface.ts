import { User, UserRole } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUsersRepository {
  create(user: CreateUserDto, tx?: unknown): Promise<User>;

  findOne(email: string, tx?: unknown): Promise<User & { user_role: UserRole }>;

  findAll(tx?: unknown): Promise<User[]>;
}
