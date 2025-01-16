import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { EmailCredentialsService } from './email-credentials.service';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './hashing.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [UsersModule, JwtModule.registerAsync(jwtConfig.asProvider())],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: 'EMAIL_CREDENTIALS_SERVICE',
      useFactory: (prisma: PrismaService) => {
        return new EmailCredentialsService(prisma);
      },
      inject: [PrismaService],
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
