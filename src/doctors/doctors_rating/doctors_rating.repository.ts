import { Injectable } from '@nestjs/common';
import { PrismaBaseRepository } from 'src/database/prisma-base.repository';
import {
  IDoctorsRatingRepository,
  ReturnType,
} from './doctors_rating.repository.interface';
import { PrismaService } from 'src/database/prisma.service';
import { DoctorsRatingEntity } from './entities/doctors_rating.entity';

@Injectable()
export class DoctorsRatingRepository
  extends PrismaBaseRepository
  implements IDoctorsRatingRepository
{
  constructor(private readonly prismaClient: PrismaService) {
    super(prismaClient);
  }

  create(rating: DoctorsRatingEntity): Promise<ReturnType | null> {
    const prisma = this.getClient();

    return prisma.doctorsRating.create({
      data: {
        doctor_id: rating.doctor_id,
        patient_id: rating.patient_id,
        rating: rating.rating,
        review: rating.review,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }
}
