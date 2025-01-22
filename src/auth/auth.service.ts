import { Inject, Injectable } from '@nestjs/common';
import { IServiceResponse } from 'src/common/service-response.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  IUsersService,
  UsersServiceSymbol,
} from 'src/users/users.service.interface';
import {
  HashingServiceSymbol,
  IHashingService,
} from './hashing.service.interface';
import {
  EmailCredentialsServiceSymbol,
  IEmailCredentialsService,
} from 'src/email-credentials/email-credentials.service.interface';
import {
  AuthMethodsServiceSymbol,
  IAuthMethodsService,
} from 'src/auth-methods/auth-methods.service.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(EmailCredentialsServiceSymbol)
    private readonly emailCredentialsService: IEmailCredentialsService,
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
    @Inject(HashingServiceSymbol)
    private readonly hashingService: IHashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(AuthMethodsServiceSymbol)
    private readonly authMethodsService: IAuthMethodsService,
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

      const token = await this.generateToken(user.id, user.email, user.role);

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

  async loginWithGoogle(email: string) {
    const { error: errorAuthMethod, data: userAuthMethod } =
      await this.authMethodsService.findOne(email);

    if (errorAuthMethod || !userAuthMethod) {
      return { error: errorAuthMethod, data: null };
    }

    const { error: errorGetUser, data: user } =
      await this.usersService.findOne(email);

    if (errorGetUser || !user) {
      return { error: errorGetUser, data: null };
    }

    const token = await this.generateToken(
      userAuthMethod.fk_user_id,
      email,
      user.user_role.role_name,
    );

    return {
      error: null,
      data: { accessToken: token },
    };
  }

  async registerWithGoogle(email, firstName, lastName, role) {
    const { error: errorFindUser, data: exisingUser } =
      await this.authMethodsService.findOne(email);

    if (errorFindUser) {
      return { error: { message: "Can't create user" }, data: null };
    }

    if (exisingUser) {
      return {
        error: { message: 'User with such email already exists' },
        data: null,
      };
    }

    const { error, data: userAuthMethod } =
      await this.authMethodsService.createNewUser(
        email,
        firstName,
        lastName,
        role,
        'google',
      );

    if (error || !userAuthMethod) {
      return { error, data: null };
    }

    return {
      error: null,
      data: {
        email: userAuthMethod.email,
      },
    };
  }

  private async validateUser(
    email: string,
    pass: string,
  ): Promise<
    Pick<User, 'id' | 'email' | 'first_name' | 'last_name'> & { role: string }
  > {
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
      role: user.user_role.role_name,
    };

    return result;
  }

  private async generateToken(userId: number, email: string, role: string) {
    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        iat: Math.floor(Date.now() / 1000),
        role,
      } as AccessTokenPayload,
      this.configService.get('jwt'),
    );

    return token;
  }
}
