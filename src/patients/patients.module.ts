import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientsServiceSymbol } from './patients.service.interface';
import { IPatientsRepository } from './patients.repository.interface';
import { PatientsRepository } from './patients.repository';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [PatientsController],
  providers: [
    PrismaService,
    PatientsRepository,
    {
      provide: PatientsServiceSymbol,
      useFactory: (patientsRepository: IPatientsRepository) => {
        return new PatientsService(patientsRepository);
      },
      inject: [PatientsRepository],
    },
  ],
  exports: [PatientsServiceSymbol],
})
export class PatientsModule {}
