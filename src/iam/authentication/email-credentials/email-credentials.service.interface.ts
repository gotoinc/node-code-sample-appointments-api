import { EmailCredentials, User } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';

export const EmailCredentialsServiceSymbol = Symbol(
  'EMAIL_CREDENTIALS_SERVICE',
);

export interface IEmailCredentialsService {
  createNewUser(
    email: string,
    firstName: string,
    lastName: string,
    roleName: string,
    hashedPassword: string,
  ): Promise<IServiceResponse<User>>;
  findOne(email: string): Promise<IServiceResponse<EmailCredentials>>;
}
