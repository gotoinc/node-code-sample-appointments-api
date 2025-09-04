import { Doctor, Specialization, User } from '@prisma/client';
import { DoctorEntity } from './entities/doctor.entity';
import { GetDoctorQuery } from './dto/doctor.dto';

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
  findAll(
    query: GetDoctorQuery,
    tx?: unknown,
  ): Promise<{ data: DoctorReturnType[]; total: number }>;
  findOne(id: number, tx?: unknown): Promise<DoctorReturnType | null>;
  findByUserId(userId: number, tx?: unknown): Promise<DoctorReturnType | null>;
  update(
    id: number,
    doctor: Partial<DoctorEntity>,
    tx?: unknown,
  ): Promise<DoctorReturnType>;
}
