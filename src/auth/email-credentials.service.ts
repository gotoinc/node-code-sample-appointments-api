import { PrismaService } from 'src/database/prisma.service';
import { EmailCredentials } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response.interface';

export class EmailCredentialsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    email: string,
    hashedPassword: string,
  ): Promise<IServiceResponse<Pick<EmailCredentials, 'id' | 'email'>>> {
    const emailAuth = await this.prisma.emailCredentials.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        fk_user_id: userId,
      },
    });

    return {
      error: null,
      data: {
        id: emailAuth.id,
        email: emailAuth.email,
      },
    };
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
