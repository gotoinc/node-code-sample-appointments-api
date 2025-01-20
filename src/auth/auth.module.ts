import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmailCredentialsService } from '../email-credentials/email-credentials.service';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './hashing.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import jwtConfig from './config/jwt.config';
import { ITransactionManager } from 'src/interfaces/transaction-manager.interface';
import { IEmailCredentialsRepository } from 'src/email-credentials/email-credentials.repository.interface';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { IRolesRepository } from 'src/roles/roles.repository.interface';
import { PrismaTransactionManager } from 'src/database/prisma-transaction.service';
import { EmailCredentialsRepository } from 'src/email-credentials/email-credentials.repository';
import { UsersRepository } from 'src/users/users.repository';
import { RolesRepository } from 'src/roles/roles.repository';

@Module({
  imports: [UsersModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    PrismaTransactionManager,
    EmailCredentialsRepository,
    UsersRepository,
    RolesRepository,
    {
      provide: 'EMAIL_CREDENTIALS_SERVICE',
      useFactory: (
        transactionManager: ITransactionManager,
        emailCredentialsRepository: IEmailCredentialsRepository,
        userRepository: IUsersRepository,
        roleRepository: IRolesRepository,
      ) => {
        return new EmailCredentialsService(
          transactionManager,
          userRepository,
          emailCredentialsRepository,
          roleRepository,
        );
      },
      inject: [
        PrismaTransactionManager,
        EmailCredentialsRepository,
        UsersRepository,
        RolesRepository,
      ],
    },
    {
      provide: 'HASHING_SERVICE',
      useFactory: () => {
        return new HashingService();
      },
    },
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
