import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { GoogleOauthModule } from './authentication/social/google/google-oauth.module';

@Module({
  imports: [AuthenticationModule, GoogleOauthModule],
})
export class IamModule {}
