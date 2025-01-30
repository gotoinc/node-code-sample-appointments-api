import { Module } from '@nestjs/common';
import { TokenGenerationServiceSymbol } from './token-generation.service.interface';
import { TokenGenerationService } from './token-generation.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { Logger } from 'nestjs-pino';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [
    ConfigService,
    {
      provide: TokenGenerationServiceSymbol,
      useFactory: (
        logger: ILogger,
        jwtService: JwtService,
        configService: ConfigService,
      ) => {
        return new TokenGenerationService(logger, jwtService, configService);
      },
      inject: [Logger, JwtService, ConfigService],
    },
  ],
  exports: [TokenGenerationServiceSymbol],
})
export class TokenGenerationModule {}
