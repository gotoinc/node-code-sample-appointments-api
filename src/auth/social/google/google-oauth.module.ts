import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  imports: [],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthGuard, GoogleOauthStrategy],
  exports: [],
})
export class GoogleOauthModule {}
