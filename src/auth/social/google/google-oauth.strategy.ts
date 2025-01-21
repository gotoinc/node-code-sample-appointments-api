import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-google-oauth2';
import { Request } from 'express';
import { ROLES } from 'src/common/constants/roles';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
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

    const { role, action } = JSON.parse(state);

    this.validateQueryParams({ role, action });

    const { given_name, family_name, email, sub } = profile._json;

    return { given_name, family_name, email, sub, role, action };
  }

  private validateQueryParams(query: any) {
    const { role, action } = query;

    if (!role) {
      throw new HttpException('Missing role', HttpStatus.BAD_REQUEST);
    }

    if (!ROLES.includes(role)) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    if (!action) {
      throw new HttpException('Missing action', HttpStatus.BAD_REQUEST);
    }

    if (action !== 'login' && action !== 'register') {
      throw new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
    }
  }
}
