import { Doctor, DoctorsRating, Patient } from '@prisma/client';
import { DoctorsRatingEntity } from './entities/doctors_rating.entity';

export interface ReturnType extends DoctorsRating {
  patient: Patient;
  doctor: Doctor;
}
export interface IDoctorsRatingRepository {
  create(rating: DoctorsRatingEntity): Promise<ReturnType | null>;
}
