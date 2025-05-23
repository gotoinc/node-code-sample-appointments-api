import { Inject, Injectable } from '@nestjs/common';
import { IServiceResponse } from 'src/common/service-response';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  IUsersService,
  UsersServiceSymbol,
} from 'src/users/users.service.interface';
import {
  HashingServiceSymbol,
  IHashingService,
} from './hashing/hashing.service.interface';
import {
  EmailCredentialsServiceSymbol,
  IEmailCredentialsService,
} from 'src/iam/authentication/email-credentials/email-credentials.service.interface';
import {
  ITokenGenerationService,
  TokenGenerationServiceSymbol,
} from './token-generation/token-generation.service.interface';
import { Logger } from 'nestjs-pino';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(Logger) private readonly logger: ILogger,
    @Inject(EmailCredentialsServiceSymbol)
    private readonly emailCredentialsService: IEmailCredentialsService,
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
    @Inject(HashingServiceSymbol)
    private readonly hashingService: IHashingService,
    @Inject(TokenGenerationServiceSymbol)
    private readonly tokenGenerationService: ITokenGenerationService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<IServiceResponse<{ accessToken: string }>> {
    try {
      const user = await this.validateUser(email, password);

      if (!user)
        return { error: { message: 'Invalid email or password' }, data: null };

      const { error: errorTokenGeneration, data: token } =
        await this.tokenGenerationService.generateToken(
          user.id,
          user.email,
          user.role,
        );

      if (errorTokenGeneration || !token)
        return { error: errorTokenGeneration, data: null };

      return {
        error: null,
        data: { accessToken: token },
      };
    } catch (error) {
      this.logger.error(error);
      return {
        error: { message: 'Login failed. Please try again.' },
        data: null,
      };
    }
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<IServiceResponse<RegisterUserResponseDto>> {
    try {
      const { first_name, last_name, email, password, role } = registerUserDto;

      const { error, data: exisingUser } =
        await this.usersService.findOne(email);

      if (error) return { error, data: null };

      if (exisingUser)
        return {
          error: { message: 'User with such email already exists' },
          data: null,
        };

      const hashedPassword = await this.hashingService.hash(password);

      const { error: createUserError, data: user } =
        await this.emailCredentialsService.createNewUser(
          email,
          first_name,
          last_name,
          role,
          hashedPassword,
        );

      if (createUserError) return { error: createUserError, data: null };
      if (!user)
        return { error: { message: 'Error while creating user' }, data: null };

      return {
        error: null,
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          user_role_id: user.user_role_id,
        },
      };
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error while creating user' }, data: null };
    }
  }

  private async validateUser(
    email: string,
    pass: string,
  ): Promise<
    | (Pick<User, 'id' | 'email' | 'first_name' | 'last_name'> & {
        role: string;
      })
    | null
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

    if (errorFindUser || !user) return null;

    const result = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.user_role.role_name,
    };

    return result;
  }
}
