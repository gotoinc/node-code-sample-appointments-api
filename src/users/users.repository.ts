import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { PrismaService } from 'src/database/prisma.service';
import { IUsersRepository } from './users.repository.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository
  extends PrismaBaseRepository
  implements IUsersRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(user: CreateUserDto, tx?: unknown): Promise<User> {
    const prisma = this.getClient(tx);

    return await prisma.user.create({
      data: {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        fk_user_role_id: user.roleId,
      },
    });
  }

  async findOne(email: string, tx?: unknown): Promise<User> {
    const prisma = this.getClient(tx);

    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll(tx?: unknown): Promise<User[]> {
    const prisma = this.getClient(tx);

    return await prisma.user.findMany();
  }
}
