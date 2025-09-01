import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUsersRepository {
  create(user: UserEntity, tx?: unknown): Promise<User>;

  findOne(
    email: string,
    tx?: unknown,
  ): Promise<(User & { user_role: UserRole }) | null>;

  findAll(tx?: unknown): Promise<User[]>;

  update(id: number, user: UpdateUserDto, tx?: unknown): Promise<User>;
}
