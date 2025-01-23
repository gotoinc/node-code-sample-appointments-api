import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth2';
import { Request } from 'express';
import { GoogleOauthQueryParamsDto } from './dto/google-oauth-query-params.dto';
import {
  GoogleOauthServiceSymbol,
  IGoogleOauthService,
} from './google-oauth.service.interface';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(GoogleOauthServiceSymbol)
    private readonly googleOauthService: IGoogleOauthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_OAUTH_REDIRECT_URI'),
      scope: ['profile', 'email'],
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
  ) {
    const state = request.query.state as string;

    if (!state) {
      throw new HttpException(
        'Missing state',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { role, action }: GoogleOauthQueryParamsDto = JSON.parse(state);

    const { given_name = '', family_name = '', email } = profile._json;

    if (action === 'login') {
      const { error, data: user } = await this.googleOauthService.login(email);

      if (error)
        throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);

      return user;
    }

    if (action === 'register') {
      if (!role)
        throw new HttpException('Role is required', HttpStatus.UNAUTHORIZED);

      const { error, data: user } = await this.googleOauthService.register(
        email,
        given_name,
        family_name,
        role,
      );

      if (error)
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);

      return user;
    }

    throw new HttpException('Operation failed', HttpStatus.UNAUTHORIZED);
  }
}
