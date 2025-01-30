import { Module } from '@nestjs/common';
import { IAuthProvidersRepository } from './auth-providers.repository.interface';
import { AuthProvidersServiceSymbol } from './auth-providers.service.interface';
import { AuthProvidersService } from './auth-providers.service';
import { AuthProvidersRepository } from './auth-providers.repository';
import { PrismaService } from 'src/database/prisma.service';
import { Logger } from 'nestjs-pino';
import { ILogger } from 'src/common/interfaces/logger.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: AuthProvidersServiceSymbol,
      useFactory: (
        logger: ILogger,
        authProvidersRepository: IAuthProvidersRepository,
      ) => {
        return new AuthProvidersService(logger, authProvidersRepository);
      },
      inject: [Logger, AuthProvidersRepository],
    },
    AuthProvidersRepository,
  ],
  exports: [AuthProvidersServiceSymbol],
})
export class AuthProvidersModule {}
