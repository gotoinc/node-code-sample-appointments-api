import { IServiceResponse } from 'src/common/service-response.interface';

export const GoogleOauthServiceSymbol = 'GOOGLE_OAUTH_SERVICE_SYMBOL';

export interface IGoogleOauthService {
  login(email: string): Promise<IServiceResponse<{ access_token: string }>>;

  register(
    email: string,
    firstName: string,
    lastName: string,
    role: 'doctor' | 'patient',
  ): Promise<IServiceResponse<{ email: string }>>;
}
