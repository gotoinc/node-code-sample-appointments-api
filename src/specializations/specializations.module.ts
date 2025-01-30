import { Module } from '@nestjs/common';
import { SpecializationsServiceSymbol } from './specializations.service.interface';
import { ISpecializationsRepository } from './specializations.repository.interface';
import { SpecializationsService } from './specializations.service';
import { SpecializationsRepository } from './specializations.repository';
import { PrismaService } from 'src/database/prisma.service';
import { SpecializationsController } from './specializations.controller';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { Logger } from 'nestjs-pino';

@Module({
  controllers: [SpecializationsController],
  providers: [
    PrismaService,
    SpecializationsRepository,
    {
      provide: SpecializationsServiceSymbol,
      useFactory: (
        logger: ILogger,
        specializationsRepository: ISpecializationsRepository,
      ) => new SpecializationsService(logger, specializationsRepository),
      inject: [Logger, SpecializationsRepository],
    },
  ],
  exports: [SpecializationsServiceSymbol],
})
export class SpecializationsModule {}
