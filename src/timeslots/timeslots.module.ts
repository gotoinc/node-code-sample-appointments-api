import { forwardRef, Module } from '@nestjs/common';
import { TimeslotsController } from './timeslots.controller';
import { PrismaService } from 'src/database/prisma.service';
import { TimeslotsRepository } from './timeslots.repository';
import { TimeslotsServiceSymbol } from './timeslots.service.interface';
import { ITimeslotsRepository } from './timeslots.repository.interface';
import { TimeslotsService } from './timeslots.service';
import {
  DoctorsServiceSymbol,
  IDoctorsService,
} from 'src/doctors/doctors.service.interface';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { Logger } from 'nestjs-pino';
import { ILogger } from 'src/common/interfaces/logger.interface';

@Module({
  imports: [forwardRef(() => DoctorsModule)],
  providers: [
    PrismaService,
    TimeslotsRepository,
    Logger,
    {
      provide: TimeslotsServiceSymbol,
      useFactory: (
        logger: ILogger,
        timeslotsRepository: ITimeslotsRepository,
        doctorsService: IDoctorsService,
      ) => {
        return new TimeslotsService(
          logger,
          timeslotsRepository,
          doctorsService,
        );
      },
      inject: [Logger, TimeslotsRepository, DoctorsServiceSymbol],
    },
  ],
  controllers: [TimeslotsController],
  exports: [TimeslotsServiceSymbol, TimeslotsRepository],
})
export class TimeslotsModule {}
