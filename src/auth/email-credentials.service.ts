import { PrismaService } from 'src/database/prisma.service';
import { EmailCredentials, User, UserRole } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response.interface';

export class EmailCredentialsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
    hashedPassword: string,
  ): Promise<User> {
    const user = await this.prisma.$transaction(async (tx) => {
      const role: UserRole = await tx.userRole.findFirst({
        where: {
          role_name: roleName,
        },
      });
      const user: User = await tx.user.create({
        data: {
          email,
          first_name: firstName,
          last_name: lastName,
          fk_user_role_id: role.id,
        },
      });

      await tx.emailCredentials.create({
        data: {
          email: user.email,
          passwordHash: hashedPassword,
          fk_user_id: user.id,
        },
      });

      return user;
    });

    return user;
  }

  async findOne(email: string): Promise<IServiceResponse<EmailCredentials>> {
    try {
      const emailCredentials: EmailCredentials =
        await this.prisma.emailCredentials.findUnique({
          where: {
            email,
          },
        });
      if (!emailCredentials) {
        return { error: null, data: null };
      }
      return { error: null, data: emailCredentials };
    } catch (error) {
      return { error: { message: error.message }, data: null };
    }
  }
}
