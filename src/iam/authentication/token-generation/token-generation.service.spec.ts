import { TokenGenerationService } from './token-generation.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { ServiceResponse } from 'src/common/service-response';

describe('TokenGenerationService', () => {
  let service: TokenGenerationService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let logger: jest.Mocked<ILogger>;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    } as any;

    configService = {
      get: jest.fn().mockReturnValue('jwt-secret'),
    } as any;

    service = new TokenGenerationService(logger, jwtService, configService);
  });

  describe('generateToken', () => {
    it('should generate a token successfully', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const role = 'admin';
      const token = 'some-jwt-token';

      jwtService.signAsync.mockResolvedValue(token);

      const response = await service.generateToken(userId, email, role);

      expect(response).toEqual(ServiceResponse.success<string>(token));
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        expect.objectContaining({ sub: userId, email, role }),
        'jwt-secret',
      );
    });

    it('should return error response when token generation fails', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const role = 'admin';

      jwtService.signAsync.mockRejectedValue(
        new Error('Token generation failed'),
      );

      const response = await service.generateToken(userId, email, role);

      expect(response).toEqual({
        error: { message: 'Error generating token' },
        data: null,
      });
      expect(logger.error).toHaveBeenCalledWith(
        new Error('Token generation failed'),
      );
    });

    it('should call configService.get with correct key', async () => {
      await service.generateToken(1, 'test@example.com', 'admin');
      expect(configService.get).toHaveBeenCalledWith('jwt');
    });
  });
});
