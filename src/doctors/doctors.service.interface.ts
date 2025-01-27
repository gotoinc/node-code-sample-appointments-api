import { IServiceResponse } from 'src/common/service-response';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Doctor } from '@prisma/client';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

export const DoctorsServiceSymbol = Symbol('DOCTORS_SERVICE');

export interface IDoctorsService {
  create(
    doctor: CreateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<Doctor>>;
  findAll(): Promise<IServiceResponse<Doctor[]>>;
  findOne(id: number): Promise<IServiceResponse<Doctor>>;
  findByUserId(userId: number): Promise<IServiceResponse<Doctor>>;
  update(
    doctor: UpdateDoctorDto,
    userId: number,
  ): Promise<IServiceResponse<Doctor>>;
}
