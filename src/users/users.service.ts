import { PrismaService } from '../database/prisma.service';
import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse } from 'src/common/service-response.interface';

export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: UserEntity): Promise<IServiceResponse<User>> {
    const existingUser: User = await this.prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      return { error: { message: 'User already exists' }, data: null };
    }

    const role: UserRole = await this.prisma.userRole.findFirst({
      where: {
        role_name: user.role,
      },
    });

    const createdUser: User = await this.prisma.user.create({
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        fk_user_role_id: role.id,
      },
    });

    return { error: null, data: createdUser };
  }

  async findOne(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async getUsers(): Promise<IServiceResponse<User[]>> {
    const users: User[] = await this.prisma.user.findMany();
    return { error: null, data: users };
  }
}
