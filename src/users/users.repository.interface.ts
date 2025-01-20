import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUsersRepository {
  create(user: CreateUserDto, tx?: unknown): Promise<User>;
  findOne(email: string, tx?: unknown): Promise<User>;
  findAll(tx?: unknown): Promise<User[]>;
}
