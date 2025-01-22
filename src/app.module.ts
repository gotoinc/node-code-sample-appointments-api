import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleOauthModule } from './auth/social/google/google-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    RolesModule,
    GoogleOauthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
