import { Controller, Get, UseGuards, Req, Res, Query } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthQueryParamsDto } from './dto/google-oauth-query-params.dto';
import * as passport from 'passport';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/auth.decorator';

@Auth('None')
@Controller('auth/google')
export class GoogleOauthController {
  constructor() {}

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
  async callback(@Req() req) {
    const user = req.user;
    return user;
  }
}
