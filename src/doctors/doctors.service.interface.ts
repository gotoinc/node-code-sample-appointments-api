import { IServiceResponse } from 'src/common/service-response';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorDto } from './dto/doctor.dto';

export const DoctorsServiceSymbol = Symbol('DOCTORS_SERVICE');

export interface IDoctorsService {
  create(
    doctor: CreateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<DoctorDto>>;
  findAll(): Promise<IServiceResponse<DoctorDto[]>>;
  findOne(id: number): Promise<IServiceResponse<DoctorDto | null>>;
  findByUserId(userId: number): Promise<IServiceResponse<DoctorDto | null>>;
  update(
    doctor: UpdateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<DoctorDto>>;
}
