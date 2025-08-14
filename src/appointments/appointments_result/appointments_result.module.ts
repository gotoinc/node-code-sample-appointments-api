import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaTransactionManager } from 'src/database/prisma-transaction.service';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { Logger } from 'nestjs-pino';
import { AppointmentsResultRepository } from './appointments_result.repository';
import { AppointmentsResultServiceSymbol } from './appointments_result.service.interface';
import { AppointmentsResultService } from './appointments_result.service';
import { IAppointmentsResultRepository } from './appointments_result.repository.interface';

@Module({
  imports: [],
  providers: [
    PrismaService,
    AppointmentsResultRepository,
    PrismaTransactionManager,
    {
      provide: AppointmentsResultServiceSymbol,
      useFactory: (
        logger: ILogger,
        appointmentsResultRepository: IAppointmentsResultRepository,
      ) => {
        return new AppointmentsResultService(
          logger,
          appointmentsResultRepository,
        );
      },
      inject: [Logger, AppointmentsResultRepository],
    },
  ],
  exports: [AppointmentsResultServiceSymbol],
})
export class AppointmentsResultModule {}
