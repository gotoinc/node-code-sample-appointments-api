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
import { TemplateScheduleModule } from './template_schedules/template_schedules.module';
import { MinioModule } from './minio-module/minio.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
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
    TemplateScheduleModule,
    MinioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
