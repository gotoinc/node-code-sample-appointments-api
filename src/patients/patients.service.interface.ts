import { Patient } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

export const PatientsServiceSymbol = Symbol('PATIENTS_SERVICE');

export interface IPatientsService {
  create(
    patient: CreatePatientDto,
    userId: number,
  ): Promise<IServiceResponse<Patient>>;
  findAll(): Promise<IServiceResponse<Patient[]>>;
  findById(id: number): Promise<IServiceResponse<Patient>>;
  findByUserId(userId: number): Promise<IServiceResponse<Patient>>;
  update(
    patient: UpdatePatientDto,
    userId: number,
  ): Promise<IServiceResponse<Patient>>;
}
