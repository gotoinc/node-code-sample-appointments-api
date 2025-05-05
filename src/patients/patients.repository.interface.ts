import { Patient, User } from '@prisma/client';
import { PatientEntity } from './entities/patient.entity';

export type PatientReturnType = Patient & {
  user: User;
};

export interface IPatientsRepository {
  create(
    patient: PatientEntity,
    userId: number,
    tx?: unknown,
  ): Promise<PatientReturnType>;
  findAll(tx?: unknown): Promise<PatientReturnType[]>;
  findById(id: number, tx?: unknown): Promise<PatientReturnType | null>;
  findByUserId(userId: number, tx?: unknown): Promise<PatientReturnType | null>;
  update(
    id: number,
    patient: PatientEntity,
    tx?: unknown,
  ): Promise<PatientReturnType>;
}
