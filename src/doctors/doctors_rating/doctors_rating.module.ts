import { Module } from '@nestjs/common';
import { DoctorsRatingService } from './doctors_rating.service';
import { DoctorsRatingRepository } from './doctors_rating.repository';
import { PrismaService } from 'src/database/prisma.service';
import { DoctorsRatingServiceSymbol } from './doctors_rating.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IDoctorsRatingRepository } from './doctors_rating.repository.interface';
import { Logger } from 'nestjs-pino';

@Module({
  imports: [],
  controllers: [],
  providers: [
    DoctorsRatingRepository,
    DoctorsRatingService,
    PrismaService,
    {
      provide: DoctorsRatingServiceSymbol,
      useFactory: (
        logger: ILogger,
        doctorsRatingRepository: IDoctorsRatingRepository,
      ) => {
        return new DoctorsRatingService(logger, doctorsRatingRepository);
      },
      inject: [Logger, DoctorsRatingRepository],
    },
  ],
  exports: [DoctorsRatingServiceSymbol],
})
export class DoctorsRatingModule {}
