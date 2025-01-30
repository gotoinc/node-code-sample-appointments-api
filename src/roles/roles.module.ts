import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/database/prisma.service';
import { RolesRepository } from './roles.repository';
import { IRolesRepository } from './roles.repository.interface';
import { RolesServiceSymbol } from './roles.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { Logger } from 'nestjs-pino';

@Module({
  controllers: [RolesController],
  providers: [
    PrismaService,
    RolesRepository,
    {
      provide: RolesServiceSymbol,
      useFactory: (logger: ILogger, rolesRepository: IRolesRepository) => {
        return new RolesService(logger, rolesRepository);
      },
      inject: [Logger, RolesRepository],
    },
  ],
  exports: [RolesServiceSymbol, RolesRepository],
})
export class RolesModule {}
