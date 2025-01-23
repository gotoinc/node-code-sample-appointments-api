import { Module } from '@nestjs/common';
import { IAuthProvidersRepository } from './auth-providers.repository.interface';
import { AuthProvidersServiceSymbol } from './auth-providers.service.interface';
import { AuthProvidersService } from './auth-providers.service';
import { AuthProvidersRepository } from './auth-providers.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: AuthProvidersServiceSymbol,
      useFactory: (authProvidersRepository: IAuthProvidersRepository) => {
        return new AuthProvidersService(authProvidersRepository);
      },
      inject: [AuthProvidersRepository],
    },
    AuthProvidersRepository,
  ],
  exports: [AuthProvidersServiceSymbol],
})
export class AuthProvidersModule {}
