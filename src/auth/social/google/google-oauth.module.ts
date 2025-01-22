import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthGuard, GoogleOauthStrategy],
  exports: [],
})
export class GoogleOauthModule {}
