import { Controller, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthQueryParamsDto } from './dto/google-oauth-query-params.dto';
import * as passport from 'passport';
import { Request, Response } from 'express';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { ConfigService } from '@nestjs/config';

@Auth('None')
@Controller('auth/google')
export class GoogleOauthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  async auth(
    @Query() queryParams: GoogleOauthQueryParamsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const state = JSON.stringify(queryParams);
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
    })(req, res);
  }

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async callback(
    @Req() req: Request & { user: { access_token: string } },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const redirectUrl = this.configService.get<string>(
      'GOOGLE_FE_REDIRECT_URL',
    )!;
    const user = req.user;
    res.redirect(`${redirectUrl}?token=${user.access_token}`);
  }
}
