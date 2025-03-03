import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { ITokenGenerationService } from './token-generation.service.interface';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ILogger } from 'src/common/interfaces/logger.interface';

export class TokenGenerationService implements ITokenGenerationService {
  constructor(
    private readonly logger: ILogger,
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

      return ServiceResponse.success<string>(token);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error generating token' }, data: null };
    }
  }
}
