import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from 'src/users/users.service';
import { EmailCredentialsService } from './email-credentials.service';
import { AuthService } from './auth.service';
import { HashingService } from './hashing.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
    @Inject('EMAIL_CREDENTIALS_SERVICE')
    private readonly emailCredentialsService: EmailCredentialsService,
    private readonly authService: AuthService,
    @Inject('HASHING_SERVICE') private readonly hashingService: HashingService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;

    const { error: errorValidateUser, data: userData } =
      await this.authService.validateUser(email, password);
    if (errorValidateUser) throw new UnauthorizedException();

    const token = await this.authService.login(userData.id, userData.email);
    return {
      access_token: token,
    };
  }

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const { first_name, last_name, email, password, role } = body;

    const { error, data: createdUser } = await this.usersService.create({
      first_name,
      last_name,
      email,
      role,
    });
    if (error) {
      throw new BadRequestException(error.message);
    }

    const hashedPassword = await this.hashingService.hash(password);
    const { error: errorCreateEmailCredentials } =
      await this.emailCredentialsService.create(
        createdUser.id,
        email,
        hashedPassword,
      );
    if (errorCreateEmailCredentials) {
      throw new BadRequestException(errorCreateEmailCredentials.message);
    }

    return createdUser;
  }
}
