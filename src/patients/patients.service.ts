import { IServiceResponse } from 'src/common/service-response';
import { IPatientsService } from './patients.service.interface';
import { Patient } from '@prisma/client';
import { CreatePatientDto } from './dto/create-patient.dto';
import { IPatientsRepository } from './patients.repository.interface';
import { PatientEntity } from './entities/patient.entity';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { ServiceResponse } from 'src/common/service-response';

export class PatientsService implements IPatientsService {
  constructor(private readonly patientsRepository: IPatientsRepository) {}

  async create(
    patient: CreatePatientDto,
    userId: number,
  ): Promise<IServiceResponse<Patient>> {
    try {
      const exisingPatient = await this.patientsRepository.findByUserId(userId);

      if (exisingPatient)
        return ServiceResponse.conflict(
          'Patient profile already exists for this user',
        );

      const patientEntity: PatientEntity = {
        dateOfBirth: new Date(patient.date_of_birth),
        gender: patient.gender,
        address: patient.address,
      };

      const createdPatient = await this.patientsRepository.create(
        patientEntity,
        userId,
      );

      return ServiceResponse.success<Patient>(createdPatient);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error creating patient' }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<Patient[]>> {
    try {
      const patients: Patient[] = await this.patientsRepository.findAll();

      return ServiceResponse.success<Patient[]>(patients);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding all patients' }, data: null };
    }
  }

  async findById(id: number): Promise<IServiceResponse<Patient | null>> {
    try {
      const patient = await this.patientsRepository.findById(id);

      return ServiceResponse.success<Patient | null>(patient);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding patient' }, data: null };
    }
  }

  async findByUserId(
    userId: number,
  ): Promise<IServiceResponse<Patient | null>> {
    try {
      const patient = await this.patientsRepository.findByUserId(userId);

      return ServiceResponse.success<Patient | null>(patient);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding patient' }, data: null };
    }
  }

  async update(
    patientToUpdate: UpdatePatientDto,
    userId: number,
  ): Promise<IServiceResponse<Patient>> {
    try {
      const existingPatient =
        await this.patientsRepository.findByUserId(userId);

      if (!existingPatient)
        return ServiceResponse.notFound('Patient not found');

      if (userId !== existingPatient.fk_user_id)
        return ServiceResponse.forbidden();

      const patientEntity: PatientEntity = {
        dateOfBirth: new Date(patientToUpdate.date_of_birth),
        gender: patientToUpdate.gender,
        address: patientToUpdate.address,
      };

      const updatedPatient = await this.patientsRepository.update(
        existingPatient.id,
        patientEntity,
      );

      return ServiceResponse.success<Patient>(updatedPatient);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error updating patient' }, data: null };
    }
  }
}
