import { User, UserRole } from '@prisma/client';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { PrismaService } from 'src/database/prisma.service';
import { IUsersRepository } from './users.repository.interface';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersRepository
  extends PrismaBaseRepository
  implements IUsersRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(user: UserEntity, tx?: unknown): Promise<User> {
    const prisma = this.getClient(tx);

    return await prisma.user.create({
      data: {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        user_role_id: user.roleId,
      },
    });
  }

  async findOne(
    email: string,
    tx?: unknown,
  ): Promise<(User & { user_role: UserRole }) | null> {
    const prisma = this.getClient(tx);

    return await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        user_role: true,
        doctor: {
          include: {
            specialization: true,
          },
        },
        patient: true,
      },
    });
  }

  async findAll(tx?: unknown): Promise<User[]> {
    const prisma = this.getClient(tx);

    return await prisma.user.findMany();
  }
}
