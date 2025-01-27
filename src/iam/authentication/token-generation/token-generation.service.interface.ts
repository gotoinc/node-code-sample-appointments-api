import { IServiceResponse } from 'src/common/service-response';

export const TokenGenerationServiceSymbol = Symbol('TOKEN_GENERATION_SERVICE');

export interface ITokenGenerationService {
  generateToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<IServiceResponse<string>>;
}
