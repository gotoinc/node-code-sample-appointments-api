import { Module } from '@nestjs/common';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { AuthenticationModule } from 'src/iam/authentication/authentication.module';
import { GoogleOauthService } from './google-oauth.service';
import { GoogleOauthServiceSymbol } from './google-oauth.service.interface';
import {
  AuthMethodsServiceSymbol,
  IAuthMethodsService,
} from '../../auth-methods/auth-methods.service.interface';
import {
  IUsersService,
  UsersServiceSymbol,
} from 'src/users/users.service.interface';
import { UsersModule } from 'src/users/users.module';
import { AuthMethodsModule } from '../../auth-methods/auth-methods.module';
import {
  ITokenGenerationService,
  TokenGenerationServiceSymbol,
} from '../../token-generation/token-generation.service.interface';
import { TokenGenerationModule } from '../../token-generation/token-generation.module';

@Module({
  imports: [
    AuthenticationModule,
    AuthMethodsModule,
    UsersModule,
    TokenGenerationModule,
  ],
  controllers: [GoogleOauthController],
  providers: [
    GoogleOauthGuard,
    GoogleOauthStrategy,
    {
      provide: GoogleOauthServiceSymbol,
      useFactory: (
        authMethodsService: IAuthMethodsService,
        usersService: IUsersService,
        tokenGenerationService: ITokenGenerationService,
      ) => {
        return new GoogleOauthService(
          authMethodsService,
          usersService,
          tokenGenerationService,
        );
      },
      inject: [
        AuthMethodsServiceSymbol,
        UsersServiceSymbol,
        TokenGenerationServiceSymbol,
      ],
    },
  ],
  exports: [],
})
export class GoogleOauthModule {}
