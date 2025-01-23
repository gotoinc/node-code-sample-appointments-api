import { UserAuthMethod } from '@prisma/client';
import { CreateAuthMethodsUserDto } from './dto/create-auth-methods-user.dto';

export interface IAuthMethodsRepository {
  create(
    userAuthMethod: CreateAuthMethodsUserDto,
    tx?: unknown,
  ): Promise<UserAuthMethod>;

  findOne(email: string, tx?: unknown): Promise<UserAuthMethod>;
}
