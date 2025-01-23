import { Module } from '@nestjs/common';
import { TokenGenerationServiceSymbol } from './token-generation.service.interface';
import { TokenGenerationService } from './token-generation.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider())],
  providers: [
    ConfigService,
    {
      provide: TokenGenerationServiceSymbol,
      useFactory: (jwtService: JwtService, configService: ConfigService) => {
        return new TokenGenerationService(jwtService, configService);
      },
      inject: [JwtService, ConfigService],
    },
  ],
  exports: [TokenGenerationServiceSymbol],
})
export class TokenGenerationModule {}
