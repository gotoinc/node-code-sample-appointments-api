import { PrismaService } from '../database/prisma.service';
import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse } from 'src/common/service-response.interface';

export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(
    user: Omit<UserEntity, 'password'>,
  ): Promise<IServiceResponse<User>> {
    try {
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
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error creating user' }, data: null };
    }
  }

  async findOne(email: string): Promise<IServiceResponse<User>> {
    try {
      const user: User = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return { error: null, data: null };
      }
      return { error: null, data: user };
    } catch (error) {
      return { error: { message: error.message }, data: null };
    }
  }

  async getUsers(): Promise<IServiceResponse<User[]>> {
    const users: User[] = await this.prisma.user.findMany();
    return { error: null, data: users };
  }
}
