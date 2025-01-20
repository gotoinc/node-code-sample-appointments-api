import { Inject, Injectable } from '@nestjs/common';
import { EmailCredentialsService } from '../email-credentials/email-credentials.service';
import { UsersService } from 'src/users/users.service';
import { IServiceResponse } from 'src/common/service-response.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashingService } from './hashing.service';
import { AccessTokenPayload } from './types/access-token-payload.interface';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('EMAIL_CREDENTIALS_SERVICE')
    private readonly emailCredentialsService: EmailCredentialsService,
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('HASHING_SERVICE') private readonly hashingService: HashingService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<IServiceResponse<{ accessToken: string }>> {
    try {
      const user = await this.validateUser(email, password);

      if (!user) {
        return { error: { message: 'Invalid email or password' }, data: null };
      }

      const token = await this.generateToken(user.id, user.email);

      return {
        error: null,
        data: { accessToken: token },
      };
    } catch (error: unknown) {
      console.error(error);

      return {
        error: { message: 'Login failed. Please try again.' },
        data: null,
      };
    }
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<IServiceResponse<User>> {
    try {
      const { first_name, last_name, email, password, role } = registerUserDto;

      const { error, data: exisingUser } =
        await this.usersService.findOne(email);

      if (error) {
        return { error: { message: "Can't create user" }, data: null };
      }
      if (exisingUser) {
        return {
          error: { message: 'User with such email already exists' },
          data: null,
        };
      }

      const hashedPassword = await this.hashingService.hash(password);

      const { error: createUserError, data: user } =
        await this.emailCredentialsService.createNewUser(
          email,
          first_name,
          last_name,
          role,
          hashedPassword,
        );

      if (createUserError) {
        return { error: createUserError, data: null };
      }

      return { error: null, data: user };
    } catch (err: unknown) {
      console.error(err);
      return { error: { message: 'Error while creating user' }, data: null };
    }
  }

  private async validateUser(
    email: string,
    pass: string,
  ): Promise<Pick<User, 'id' | 'email' | 'first_name' | 'last_name'>> {
    const { error, data: userCredentials } =
      await this.emailCredentialsService.findOne(email);

    if (!userCredentials || error) return null;

    const isValidCredentials = this.hashingService.verify(
      pass,
      userCredentials.password_hash,
    );

    if (!isValidCredentials) return null;

    const { error: errorFindUser, data: user } =
      await this.usersService.findOne(email);

    if (errorFindUser) return null;

    const result = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return result;
  }

  private async generateToken(userId: number, email: string) {
    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        iat: Math.floor(Date.now() / 1000),
      } as AccessTokenPayload,
      this.configService.get('jwt'),
    );

    return token;
  }
}
