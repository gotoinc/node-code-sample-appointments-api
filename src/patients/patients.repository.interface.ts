import { Patient } from '@prisma/client';
import { PatientEntity } from './entities/patient.entity';

export interface IPatientsRepository {
  create(
    patient: PatientEntity,
    userId: number,
    tx?: unknown,
  ): Promise<Patient>;
  findAll(tx?: unknown): Promise<Patient[]>;
  findById(id: number, tx?: unknown): Promise<Patient>;
  findByUserId(userId: number, tx?: unknown): Promise<Patient>;
}
