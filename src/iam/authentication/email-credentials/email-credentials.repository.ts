import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import { IEmailCredentialsRepository } from './email-credentials.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { EmailCredentials } from '@prisma/client';
import { CreateEmailCredentialsDto } from 'src/iam/authentication/email-credentials/dto/create-email-credentials.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailCredentialsRepository
  extends PrismaBaseRepository
  implements IEmailCredentialsRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  async create(
    emailCredentials: CreateEmailCredentialsDto,
    tx?: unknown,
  ): Promise<EmailCredentials> {
    const prisma = this.getClient(tx);

    return await prisma.emailCredentials.create({
      data: {
        email: emailCredentials.email,
        password_hash: emailCredentials.passwordHash,
        fk_user_id: emailCredentials.userId,
      },
    });
  }

  async findOne(email: string, tx?: unknown): Promise<EmailCredentials | null> {
    const prisma = this.getClient(tx);

    return await prisma.emailCredentials.findUnique({
      where: {
        email,
      },
    });
  }
}
