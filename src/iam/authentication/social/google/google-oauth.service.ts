import { IServiceResponse } from 'src/common/service-response.interface';
import { IGoogleOauthService } from './google-oauth.service.interface';
import { IAuthMethodsService } from '../../auth-methods/auth-methods.service.interface';
import { IUsersService } from 'src/users/users.service.interface';
import { ITokenGenerationService } from '../../token-generation/token-generation.service.interface';

export class GoogleOauthService implements IGoogleOauthService {
  constructor(
    private readonly authMethodsService: IAuthMethodsService,
    private readonly usersService: IUsersService,
    private readonly tokenGenerationService: ITokenGenerationService,
  ) {}

  async login(
    email: string,
  ): Promise<IServiceResponse<{ access_token: string }>> {
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

    const { error: errorTokenGeneration, data: token } =
      await this.tokenGenerationService.generateToken(
        userAuthMethod.fk_user_id,
        email,
        user.user_role.role_name,
      );

    if (errorTokenGeneration) {
      return { error: errorTokenGeneration, data: null };
    }

    return {
      error: null,
      data: { access_token: token },
    };
  }

  async register(
    email: string,
    firstName: string,
    lastName: string,
    role: 'doctor' | 'patient',
  ): Promise<IServiceResponse<{ email: string }>> {
    const { error: errorFindUser, data: exisingUser } =
      await this.authMethodsService.findOne(email);

    if (errorFindUser) {
      return { error: errorFindUser, data: null };
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
}
