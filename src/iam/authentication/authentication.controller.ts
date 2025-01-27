import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { Response } from 'express';

@Auth('None')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const { email, password } = body;

    const { error, data } = await this.authService.login(email, password);

    if (error) throw new UnauthorizedException(error.message);
    if (!data) throw new UnauthorizedException('Invalid email or password');

    res.setHeader('Authorization', `Bearer ${data.accessToken}`);
    res.json({
      access_token: data.accessToken,
    });
  }

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    const { error, data } = await this.authService.register(body);

    if (error) throw new BadRequestException(error.message);

    return data;
  }
}
