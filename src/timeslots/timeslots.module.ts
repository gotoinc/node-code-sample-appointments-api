import { Module } from '@nestjs/common';
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

@Module({
  imports: [DoctorsModule],
  providers: [
    PrismaService,
    TimeslotsRepository,
    {
      provide: TimeslotsServiceSymbol,
      useFactory: (
        timeslotsRepository: ITimeslotsRepository,
        doctorsService: IDoctorsService,
      ) => {
        return new TimeslotsService(timeslotsRepository, doctorsService);
      },
      inject: [TimeslotsRepository, DoctorsServiceSymbol],
    },
  ],
  controllers: [TimeslotsController],
  exports: [TimeslotsServiceSymbol],
})
export class TimeslotsModule {}
