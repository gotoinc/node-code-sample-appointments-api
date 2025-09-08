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
import { MinioModule } from 'src/minio-module/minio.module';
import {
  IMinioService,
  MinioServiceSymbol,
} from 'src/minio-module/minio.service.interface';

@Module({
  imports: [RolesModule, MinioModule],
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
        minioService: IMinioService,
      ) => {
        return new UsersService(
          logger,
          usersRepository,
          rolesService,
          minioService,
        );
      },
      inject: [Logger, UsersRepository, RolesServiceSymbol, MinioServiceSymbol],
    },
    JwtAuthGuard,
  ],
  exports: [UsersServiceSymbol, UsersRepository],
})
export class UsersModule {}
