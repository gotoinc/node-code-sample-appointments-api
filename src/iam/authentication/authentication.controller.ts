import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { Response, Request } from 'express';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import {
  ApiLoginDocs,
  ApiRegisterDocs,
} from './decorators/auth.docs.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePasswordResponseDto } from './dto/update-password-response.dto';

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

  @Auth('Jwt')
  @Post('/password')
  async updatePassword(
    @Body() body: UpdatePasswordDto,
    @Req() req: Request,
  ): Promise<UpdatePasswordResponseDto> {
    const user = req.user!;

    if (body.old_password === body.new_password) {
      throw new BadRequestException(
        'New password cannot be the same as the current password',
      );
    }

    const { error, data } = await this.authService.updatePassword(user, body);

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new ServiceUnavailableException(`Cannot update password`);

    return data;
  }
}
