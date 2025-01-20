import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { PrismaService } from 'src/database/prisma.service';
import { IRolesRepository } from 'src/roles/roles.repository.interface';

@Injectable()
export class RolesRepository
  extends PrismaBaseRepository
  implements IRolesRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async findByName(name: string, tx?: unknown): Promise<UserRole> {
    const prisma = this.getClient(tx);

    return await prisma.userRole.findFirst({
      where: {
        role_name: name,
      },
    });
  }
}
