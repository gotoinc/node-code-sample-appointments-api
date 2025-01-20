import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { HashingService } from './hashing.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import jwtConfig from './config/jwt.config';
import { HashingServiceSymbol } from './hashing.service.interface';
import { EmailCredentialsModule } from 'src/email-credentials/email-credentials.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    EmailCredentialsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingServiceSymbol,
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
