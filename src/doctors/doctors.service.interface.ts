import { IServiceResponse } from 'src/common/service-response';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorDto } from './dto/doctor.dto';
import { GetDoctorQuery } from './dto/get-doctor-query.dto';
import { CreateDoctorsRatingDto } from './dto/create-doctor-rating.dto';
import { DoctorsRatingDto } from './dto/doctor-rating.dto';

export const DoctorsServiceSymbol = Symbol('DOCTORS_SERVICE');

export interface IDoctorsService {
  create(
    doctor: CreateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<DoctorDto>>;
  findAll(
    query: GetDoctorQuery,
  ): Promise<IServiceResponse<{ data: DoctorDto[]; total: number }>>;
  findOne(id: number): Promise<IServiceResponse<DoctorDto | null>>;
  findByUserId(userId: number): Promise<IServiceResponse<DoctorDto | null>>;
  update(
    doctor: UpdateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<DoctorDto>>;
  addDoctorRating(
    doctorsRating: CreateDoctorsRatingDto,
    patient_id: number,
  ): Promise<IServiceResponse<DoctorsRatingDto | null>>;
}
