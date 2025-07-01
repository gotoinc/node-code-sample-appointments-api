import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

import { Logger } from 'nestjs-pino';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { TemplateScheduleServiceSymbol } from './template_schedules.service.interface';
import { ITemplateScheduleRepository } from './template_schedules.repository.interface';
import {
  DoctorsServiceSymbol,
  IDoctorsService,
} from 'src/doctors/doctors.service.interface';
import { TemplateScheduleRepository } from './template_schedules.repository';
import { TemplateScheduleService } from './template_schedules.service';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { TemplateScheduleController } from './template_schedule.controller';

@Module({
  imports: [DoctorsModule],
  providers: [
    PrismaService,
    TemplateScheduleRepository,
    Logger,
    {
      provide: TemplateScheduleServiceSymbol,
      useFactory: (
        logger: ILogger,
        templateRepository: ITemplateScheduleRepository,
        doctorsService: IDoctorsService,
      ) => {
        return new TemplateScheduleService(
          logger,
          templateRepository,
          doctorsService,
        );
      },
      inject: [Logger, TemplateScheduleRepository, DoctorsServiceSymbol],
    },
  ],
  controllers: [TemplateScheduleController],
  exports: [TemplateScheduleServiceSymbol],
})
export class TemplateScheduleModule {}
