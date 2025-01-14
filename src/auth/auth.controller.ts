import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email } = body;
    const foundUser = await this.usersService.findOne(email);
    return foundUser;
  }

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const { first_name, last_name, email, password, role } = body;
    const { error, data: createdUser } = await this.usersService.create({
      first_name,
      last_name,
      email,
      password,
      role,
    });
    if (error) {
      throw new BadRequestException(error.message);
    }
    return createdUser;
  }
}
