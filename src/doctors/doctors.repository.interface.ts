import { Doctor, Specialization, User } from '@prisma/client';
import { DoctorEntity } from './entities/doctor.entity';

export type DoctorReturnType = Doctor & {
  specialization: Specialization;
  user: User;
};

export interface IDoctorsRepository {
  create(
    doctor: DoctorEntity,
    userId: number,
    tx?: unknown,
  ): Promise<DoctorReturnType>;
  findAll(tx?: unknown): Promise<DoctorReturnType[]>;
  findOne(id: number, tx?: unknown): Promise<DoctorReturnType | null>;
  findByUserId(userId: number, tx?: unknown): Promise<DoctorReturnType | null>;
  update(
    id: number,
    doctor: DoctorEntity,
    tx?: unknown,
  ): Promise<DoctorReturnType>;
}
