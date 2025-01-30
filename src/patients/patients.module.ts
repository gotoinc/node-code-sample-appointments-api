import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientsServiceSymbol } from './patients.service.interface';
import { IPatientsRepository } from './patients.repository.interface';
import { PatientsRepository } from './patients.repository';
import { PrismaService } from 'src/database/prisma.service';
import { Logger } from 'nestjs-pino';
import { ILogger } from 'src/common/interfaces/logger.interface';

@Module({
  controllers: [PatientsController],
  providers: [
    PrismaService,
    PatientsRepository,
    {
      provide: PatientsServiceSymbol,
      useFactory: (
        logger: ILogger,
        patientsRepository: IPatientsRepository,
      ) => {
        return new PatientsService(logger, patientsRepository);
      },
      inject: [Logger, PatientsRepository],
    },
  ],
  exports: [PatientsServiceSymbol],
})
export class PatientsModule {}
