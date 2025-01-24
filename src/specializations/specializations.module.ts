import { Module } from '@nestjs/common';
import { SpecializationsServiceSymbol } from './specializations.service.interface';
import { ISpecializationsRepository } from './specializations.repository.interface';
import { SpecializationsService } from './specializations.service';
import { SpecializationsRepository } from './specializations.repository';
import { PrismaService } from 'src/database/prisma.service';
import { SpecializationsController } from './specializations.controller';

@Module({
  controllers: [SpecializationsController],
  providers: [
    PrismaService,
    SpecializationsRepository,
    {
      provide: SpecializationsServiceSymbol,
      useFactory: (specializationsRepository: ISpecializationsRepository) =>
        new SpecializationsService(specializationsRepository),
      inject: [SpecializationsRepository],
    },
  ],
  exports: [SpecializationsServiceSymbol],
})
export class SpecializationsModule {}
