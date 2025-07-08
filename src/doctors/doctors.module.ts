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

@Module({
  imports: [SpecializationsModule, forwardRef(() => TemplateScheduleModule)],
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
      ) => {
        return new DoctorsService(
          logger,
          doctorsRepository,
          specializationService,
        );
      },
      inject: [Logger, DoctorsRepository, SpecializationsServiceSymbol],
    },
  ],
  exports: [DoctorsServiceSymbol],
})
export class DoctorsModule {}
