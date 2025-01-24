import { IServiceResponse } from 'src/common/interfaces/service-response.interface';
import { IPatientsService } from './patients.service.interface';
import { Patient } from '@prisma/client';
import { CreatePatientDto } from './dto/create-patient.dto';
import { IPatientsRepository } from './patients.repository.interface';
import { PatientEntity } from './entities/patient.entity';

export class PatientsService implements IPatientsService {
  constructor(private readonly patientsRepository: IPatientsRepository) {}

  async create(
    patient: CreatePatientDto,
    userId: number,
  ): Promise<IServiceResponse<Patient>> {
    try {
      const exisingPatient = await this.patientsRepository.findByUserId(userId);

      if (exisingPatient)
        return {
          error: { message: 'Patient profile already exists for this user' },
          data: null,
        };

      const patientEntity: PatientEntity = {
        dateOfBirth: new Date(patient.date_of_birth),
        gender: patient.gender,
        address: patient.address,
      };

      const createdPatient = await this.patientsRepository.create(
        patientEntity,
        userId,
      );

      return { error: null, data: createdPatient };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error creating patient' }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<Patient[]>> {
    try {
      const patients: Patient[] = await this.patientsRepository.findAll();

      return { error: null, data: patients };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding all patients' }, data: null };
    }
  }

  async findById(id: number): Promise<IServiceResponse<Patient>> {
    try {
      const patient = await this.patientsRepository.findById(id);

      return { error: null, data: patient };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding patient' }, data: null };
    }
  }

  async findByUserId(userId: number): Promise<IServiceResponse<Patient>> {
    try {
      const patient = await this.patientsRepository.findByUserId(userId);

      return { error: null, data: patient };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding patient' }, data: null };
    }
  }
}
