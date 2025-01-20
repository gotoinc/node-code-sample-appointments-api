import { Module } from '@nestjs/common';
import { EmailCredentialsService } from './email-credentials.service';
import { EmailCredentialsServiceSymbol } from './email-credentials.service.interface';
import { PrismaTransactionManager } from 'src/database/prisma-transaction.service';
import { EmailCredentialsRepository } from './email-credentials.repository';
import { UsersRepository } from 'src/users/users.repository';
import { RolesRepository } from 'src/roles/roles.repository';
import { IEmailCredentialsRepository } from './email-credentials.repository.interface';
import { ITransactionManager } from 'src/interfaces/transaction-manager.interface';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { IRolesRepository } from 'src/roles/roles.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule],
  providers: [
    PrismaService,
    PrismaTransactionManager,
    EmailCredentialsRepository,
    {
      provide: EmailCredentialsServiceSymbol,
      useFactory: (
        transactionManager: ITransactionManager,
        emailCredentialsRepository: IEmailCredentialsRepository,
        usersRepository: IUsersRepository,
        rolesRepository: IRolesRepository,
      ) => {
        return new EmailCredentialsService(
          transactionManager,
          usersRepository,
          emailCredentialsRepository,
          rolesRepository,
        );
      },
      inject: [
        PrismaTransactionManager,
        EmailCredentialsRepository,
        UsersRepository,
        RolesRepository,
      ],
    },
  ],
  exports: [EmailCredentialsServiceSymbol],
})
export class EmailCredentialsModule {}
