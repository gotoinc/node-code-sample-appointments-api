import { IServiceResponse } from 'src/common/service-response';
import { ITokenGenerationService } from './token-generation.service.interface';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class TokenGenerationService implements ITokenGenerationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<IServiceResponse<string>> {
    try {
      const token = await this.jwtService.signAsync(
        {
          sub: userId,
          email,
          iat: Math.floor(Date.now() / 1000),
          role,
        } as AccessTokenPayload,
        this.configService.get('jwt'),
      );

      return { error: null, data: token };
    } catch (error) {
      console.error(error);

      return { error: { message: error.message }, data: null };
    }
  }
}
