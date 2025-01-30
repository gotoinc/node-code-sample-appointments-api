import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { IAppointmentsRepository } from './appointments.repository.interface';
import {
  IPatientsService,
  PatientsServiceSymbol,
} from 'src/patients/patients.service.interface';
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
import { ITimeslotsRepository } from 'src/timeslots/timeslots.repository.interface';
import { TimeslotsRepository } from 'src/timeslots/timeslots.repository';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { PrismaTransactionManager } from 'src/database/prisma-transaction.service';

@Module({
  imports: [PatientsModule, TimeslotsModule, DoctorsModule],
  providers: [
    PrismaService,
    AppointmentsRepository,
    PrismaTransactionManager,
    {
      provide: AppointmentsServiceSymbol,
      useFactory: (
        appointmentsRepository: IAppointmentsRepository,
        patientsService: IPatientsService,
        timeslotsRepository: ITimeslotsRepository,
        doctorsService: IDoctorsService,
        transactionManager: ITransactionManager,
      ) => {
        return new AppointmentsService(
          appointmentsRepository,
          patientsService,
          timeslotsRepository,
          doctorsService,
          transactionManager,
        );
      },
      inject: [
        AppointmentsRepository,
        PatientsServiceSymbol,
        TimeslotsRepository,
        DoctorsServiceSymbol,
        PrismaTransactionManager,
      ],
    },
  ],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
