import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('EMAIL_CREDENTIALS_SERVICE')
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;

    const { error, data } = await this.authService.login(email, password);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      access_token: data.accessToken,
    };
  }

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    const { error, data } = await this.authService.register(body);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }
}
