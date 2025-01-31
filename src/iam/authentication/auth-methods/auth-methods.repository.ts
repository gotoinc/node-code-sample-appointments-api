import { UserAuthMethod } from '@prisma/client';
import { IAuthMethodsRepository } from './auth-methods.repository.interface';
import { CreateAuthMethodsUserDto } from './dto/create-auth-methods-user.dto';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthMethodsRepository
  extends PrismaBaseRepository
  implements IAuthMethodsRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(
    userAuthMethod: CreateAuthMethodsUserDto,
    tx?: unknown,
  ): Promise<UserAuthMethod> {
    const prisma = this.getClient(tx);

    return await prisma.userAuthMethod.create({
      data: {
        email: userAuthMethod.email,
        user_id: userAuthMethod.userId,
        auth_provider_id: userAuthMethod.authProviderId,
      },
    });
  }

  async findOne(email: string, tx?: unknown): Promise<UserAuthMethod | null> {
    const prisma = this.getClient(tx);

    return await prisma.userAuthMethod.findUnique({
      where: {
        email,
      },
    });
  }
}
