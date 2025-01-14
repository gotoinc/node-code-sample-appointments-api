import { UserRole } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response.interface';
import { PrismaService } from 'src/database/prisma.service';

export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(roleName: string): Promise<IServiceResponse<UserRole>> {
    const existingRole = await this.prisma.userRole.findFirst({
      where: {
        role_name: roleName,
      },
    });
    if (existingRole) {
      return { error: { message: 'Role already exists' }, data: null };
    }
    const role = await this.prisma.userRole.create({
      data: {
        role_name: roleName,
      },
    });

    return { error: null, data: role };
  }

  async findAll() {
    const allRoles: UserRole[] = await this.prisma.userRole.findMany();
    return { error: null, data: allRoles };
  }
}
