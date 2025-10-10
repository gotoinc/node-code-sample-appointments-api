import { IDoctorsRatingService } from './doctors_rating.service.interface';
import { CreateDoctorsRatingDto } from '../dto/create-doctor-rating.dto';
import { DoctorsRatingDto } from '../dto/doctor-rating.dto';
import { IDoctorsRatingRepository } from './doctors_rating.repository.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { DoctorsRatingEntity } from './entities/doctors_rating.entity';
import { ServiceResponse } from 'src/common/service-response';

export class DoctorsRatingService implements IDoctorsRatingService {
  constructor(
    private readonly logger: ILogger,
    private readonly doctorsRatingRepository: IDoctorsRatingRepository,
  ) {}

  async create(
    createDoctorRatingDto: CreateDoctorsRatingDto,
    patient_id: number,
  ): Promise<ServiceResponse<DoctorsRatingDto | null>> {
    try {
      const entity: DoctorsRatingEntity = {
        doctor_id: createDoctorRatingDto.doctor_id,
        patient_id,
        rating: createDoctorRatingDto.rating,
        review: createDoctorRatingDto.review,
      };

      const result = await this.doctorsRatingRepository.create(entity);
      if (!result) {
        return ServiceResponse.invalidData('Failed to create doctor rating');
      }

      return ServiceResponse.success<DoctorsRatingDto>(result);
    } catch (error) {
      this.logger.error('Error creating doctor rating', error);

      return { data: null, error: error.message || 'Unknown error' };
    }
  }
}
