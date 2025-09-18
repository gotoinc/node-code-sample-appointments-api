import { forwardRef, Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DoctorsServiceSymbol } from './doctors.service.interface';
import { IDoctorsRepository } from './doctors.repository.interface';
import { DoctorsRepository } from './doctors.repository';
import {
  ISpecializationsService,
  SpecializationsServiceSymbol,
} from 'src/specializations/specializations.service.interface';
import { SpecializationsModule } from 'src/specializations/specializations.module';
import { PrismaService } from 'src/database/prisma.service';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { Logger } from 'nestjs-pino';
import { TemplateScheduleModule } from 'src/template_schedules/template_schedules.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { AppointmentsRepository } from 'src/appointments/appointments.repository';
import { IAppointmentsRepository } from 'src/appointments/appointments.repository.interface';
import { DoctorsRatingModule } from './doctors_rating/doctors_rating.module';
import {
  DoctorsRatingServiceSymbol,
  IDoctorsRatingService,
} from './doctors_rating/doctors_rating.service.interface';

@Module({
  imports: [
    SpecializationsModule,
    forwardRef(() => TemplateScheduleModule),
    forwardRef(() => AppointmentsModule),
    DoctorsRatingModule,
  ],
  controllers: [DoctorsController],
  providers: [
    PrismaService,
    DoctorsRepository,
    {
      provide: DoctorsServiceSymbol,
      useFactory: (
        logger: ILogger,
        doctorsRepository: IDoctorsRepository,
        specializationService: ISpecializationsService,
        appointmentsRepository: IAppointmentsRepository,
        doctorsRatingService: IDoctorsRatingService,
      ) => {
        return new DoctorsService(
          logger,
          doctorsRepository,
          specializationService,
          appointmentsRepository,
          doctorsRatingService,
        );
      },
      inject: [
        Logger,
        DoctorsRepository,
        SpecializationsServiceSymbol,
        AppointmentsRepository,
        DoctorsRatingServiceSymbol,
      ],
    },
  ],
  exports: [DoctorsServiceSymbol],
})
export class DoctorsModule {}
