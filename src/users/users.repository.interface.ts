import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';

export interface IUsersRepository {
  create(user: UserEntity, tx?: unknown): Promise<User>;

  findOne(email: string, tx?: unknown): Promise<User & { user_role: UserRole }>;

  findAll(tx?: unknown): Promise<User[]>;
}
