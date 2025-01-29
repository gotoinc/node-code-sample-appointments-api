import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { IAppointmentsRepository } from './appointments.repository.interface';
import {
  IPatientsService,
  PatientsServiceSymbol,
} from 'src/patients/patients.service.interface';
import {
  ITimeslotsService,
  TimeslotsServiceSymbol,
} from 'src/timeslots/timeslots.service.interface';
import {
  DoctorsServiceSymbol,
  IDoctorsService,
} from 'src/doctors/doctors.service.interface';
import { PrismaService } from 'src/database/prisma.service';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsServiceSymbol } from './appointments.service.interface';
import { AppointmentsService } from './appointments.service';
import { PatientsModule } from 'src/patients/patients.module';
import { TimeslotsModule } from 'src/timeslots/timeslots.module';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports: [PatientsModule, TimeslotsModule, DoctorsModule],
  providers: [
    PrismaService,
    AppointmentsRepository,
    {
      provide: AppointmentsServiceSymbol,
      useFactory: (
        appointmentsRepository: IAppointmentsRepository,
        patientsService: IPatientsService,
        timeslotsService: ITimeslotsService,
        doctorsService: IDoctorsService,
      ) => {
        return new AppointmentsService(
          appointmentsRepository,
          patientsService,
          timeslotsService,
          doctorsService,
        );
      },
      inject: [
        AppointmentsRepository,
        PatientsServiceSymbol,
        TimeslotsServiceSymbol,
        DoctorsServiceSymbol,
      ],
    },
  ],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
