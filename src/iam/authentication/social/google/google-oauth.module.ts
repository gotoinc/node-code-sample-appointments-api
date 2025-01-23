import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { AuthenticationModule } from 'src/iam/authentication/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthGuard, GoogleOauthStrategy],
  exports: [],
})
export class GoogleOauthModule {}
