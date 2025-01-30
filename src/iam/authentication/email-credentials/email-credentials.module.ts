import { Module } from '@nestjs/common';
import { EmailCredentialsService } from './email-credentials.service';
import { EmailCredentialsServiceSymbol } from './email-credentials.service.interface';
import { PrismaTransactionManager } from 'src/database/prisma-transaction.service';
import { EmailCredentialsRepository } from './email-credentials.repository';
import { UsersRepository } from 'src/users/users.repository';
import { IEmailCredentialsRepository } from './email-credentials.repository.interface';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { RolesModule } from 'src/roles/roles.module';
import {
  IRolesService,
  RolesServiceSymbol,
} from 'src/roles/roles.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { Logger } from 'nestjs-pino';

@Module({
  imports: [UsersModule, RolesModule],
  providers: [
    PrismaService,
    PrismaTransactionManager,
    EmailCredentialsRepository,
    {
      provide: EmailCredentialsServiceSymbol,
      useFactory: (
        logger: ILogger,
        transactionManager: ITransactionManager,
        emailCredentialsRepository: IEmailCredentialsRepository,
        usersRepository: IUsersRepository,
        rolesService: IRolesService,
      ) => {
        return new EmailCredentialsService(
          logger,
          transactionManager,
          usersRepository,
          emailCredentialsRepository,
          rolesService,
        );
      },
      inject: [
        Logger,
        PrismaTransactionManager,
        EmailCredentialsRepository,
        UsersRepository,
        RolesServiceSymbol,
      ],
    },
  ],
  exports: [EmailCredentialsServiceSymbol],
})
export class EmailCredentialsModule {}
