import { Module } from '@nestjs/common';
import { RolesModule } from 'src/roles/roles.module';
import { UsersModule } from 'src/users/users.module';
import { AuthProvidersModule } from './auth-providers/auth-providers.module';
import { AuthMethodsServiceSymbol } from './auth-methods.service.interface';
import {
  AuthProvidersServiceSymbol,
  IAuthProvidersService,
} from './auth-providers/auth-providers.service.interface';
import { IUsersRepository } from 'src/users/users.repository.interface';
import {
  IRolesService,
  RolesServiceSymbol,
} from 'src/roles/roles.service.interface';
import { AuthMethodsService } from './auth-methods.service';
import { UsersRepository } from 'src/users/users.repository';
import { AuthMethodsRepository } from './auth-methods.repository';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IAuthMethodsRepository } from './auth-methods.repository.interface';
import { PrismaTransactionManager } from 'src/database/prisma-transaction.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [AuthProvidersModule, UsersModule, RolesModule],
  controllers: [],
  providers: [
    PrismaService,
    PrismaTransactionManager,
    UsersRepository,
    AuthMethodsRepository,
    {
      provide: AuthMethodsServiceSymbol,
      useFactory: (
        transactionManager: ITransactionManager,
        rolesService: IRolesService,
        usersRepository: IUsersRepository,
        authMethodsRepository: IAuthMethodsRepository,
        authProvidersService: IAuthProvidersService,
      ) => {
        return new AuthMethodsService(
          transactionManager,
          rolesService,
          usersRepository,
          authMethodsRepository,
          authProvidersService,
        );
      },
      inject: [
        PrismaTransactionManager,
        RolesServiceSymbol,
        UsersRepository,
        AuthMethodsRepository,
        AuthProvidersServiceSymbol,
      ],
    },
  ],
  exports: [AuthMethodsServiceSymbol],
})
export class AuthMethodsModule {}
