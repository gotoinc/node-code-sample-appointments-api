import { EmailCredentials } from '@prisma/client';
import { CreateEmailCredentialsDto } from './dto/create-email-credentials.dto';

export interface IEmailCredentialsRepository {
  create(
    emailCredentials: CreateEmailCredentialsDto,
    tx?: unknown,
  ): Promise<EmailCredentials>;

  findOne(email: string): Promise<EmailCredentials | null>;
}
