import { AuthProvider } from '@prisma/client';
import { IAuthProvidersRepository } from './auth-providers.repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthProvidersRepository
  extends PrismaBaseRepository
  implements IAuthProvidersRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async findOne(authProviderName: string, tx?: unknown): Promise<AuthProvider> {
    const prisma = this.getClient(tx);

    return await prisma.authProvider.findUnique({
      where: {
        auth_provider_name: authProviderName,
      },
    });
  }

  async create(authProviderName: string, tx?: unknown): Promise<AuthProvider> {
    const prisma = this.getClient(tx);

    return await prisma.authProvider.create({
      data: {
        auth_provider_name: authProviderName,
      },
    });
  }
}
