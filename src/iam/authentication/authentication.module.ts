import { Module } from '@nestjs/common';
import { AuthController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailCredentialsModule } from 'src/iam/authentication/email-credentials/email-credentials.module';
import { AuthMethodsModule } from 'src/iam/authentication/auth-methods/auth-methods.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../authorization/guards/roles.guard';
import { HashingModule } from './hashing/hashing.module';
import { TokenGenerationModule } from './token-generation/token-generation.module';

@Module({
  imports: [
    UsersModule,
    EmailCredentialsModule,
    AuthMethodsModule,
    HashingModule,
    TokenGenerationModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    JwtAuthGuard,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [JwtAuthGuard, AuthenticationService],
})
export class AuthenticationModule {}
