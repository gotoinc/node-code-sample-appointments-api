import { Module } from '@nestjs/common';
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

@Module({
  imports: [SpecializationsModule],
  controllers: [DoctorsController],
  providers: [
    PrismaService,
    DoctorsRepository,
    {
      provide: DoctorsServiceSymbol,
      useFactory: (
        doctorsRepository: IDoctorsRepository,
        specializationService: ISpecializationsService,
      ) => {
        return new DoctorsService(doctorsRepository, specializationService);
      },
      inject: [DoctorsRepository, SpecializationsServiceSymbol],
    },
  ],
})
export class DoctorsModule {}
