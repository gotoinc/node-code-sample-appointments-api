import { ServiceResponse } from 'src/common/service-response';
import { CreateDoctorsRatingDto } from '../dto/create-doctor-rating.dto';
import { DoctorsRatingDto } from '../dto/doctor-rating.dto';

export const DoctorsRatingServiceSymbol = Symbol('DOCTORS_RATING_SERVICE');

export interface IDoctorsRatingService {
  create(
    createDoctorRatingDto: CreateDoctorsRatingDto,
    patient_id: number,
  ): Promise<ServiceResponse<DoctorsRatingDto | null>>;
}
