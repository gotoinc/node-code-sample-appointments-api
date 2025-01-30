import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { IamModule } from './iam/iam.module';
import { DoctorsModule } from './doctors/doctors.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { PatientsModule } from './patients/patients.module';
import { TimeslotsModule } from './timeslots/timeslots.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    IamModule,
    RolesModule,
    UsersModule,
    DoctorsModule,
    SpecializationsModule,
    PatientsModule,
    TimeslotsModule,
    AppointmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
