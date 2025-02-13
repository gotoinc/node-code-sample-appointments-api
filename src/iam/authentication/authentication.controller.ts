import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { Response } from 'express';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import {
  ApiLoginDocs,
  ApiRegisterDocs,
} from './decorators/auth.docs.decorator';

@Auth('None')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @ApiLoginDocs()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserResponseDto> {
    const { email, password } = body;

    const { error, data } = await this.authService.login(email, password);

    if (error) throw new UnauthorizedException(error.message);
    if (!data) throw new UnauthorizedException('Invalid email or password');

    res.setHeader('Authorization', `Bearer ${data.accessToken}`);

    return {
      access_token: data.accessToken,
    };
  }

  @ApiRegisterDocs()
  @Post('/register')
  async register(
    @Body() body: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    const { error, data } = await this.authService.register(body);

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new ServiceUnavailableException(`Cannot register user`);

    return data;
  }
}
