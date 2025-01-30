import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/iam/authentication/guards/jwt-auth.guard';
import { UsersServiceSymbol } from './users.service.interface';
import { UsersRepository } from './users.repository';
import { RolesModule } from 'src/roles/roles.module';
import { IUsersRepository } from './users.repository.interface';
import {
  IRolesService,
  RolesServiceSymbol,
} from 'src/roles/roles.service.interface';
import { Logger } from 'nestjs-pino';
import { ILogger } from 'src/common/interfaces/logger.interface';

@Module({
  imports: [RolesModule],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UsersRepository,
    {
      provide: UsersServiceSymbol,
      useFactory: (
        logger: ILogger,
        usersRepository: IUsersRepository,
        rolesService: IRolesService,
      ) => {
        return new UsersService(logger, usersRepository, rolesService);
      },
      inject: [Logger, UsersRepository, RolesServiceSymbol],
    },
    JwtAuthGuard,
  ],
  exports: [UsersServiceSymbol, UsersRepository],
})
export class UsersModule {}
