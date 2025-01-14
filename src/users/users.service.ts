import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: any): Promise<User> {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async getUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
