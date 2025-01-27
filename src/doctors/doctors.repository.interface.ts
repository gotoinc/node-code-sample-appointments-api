import { Doctor } from '@prisma/client';
import { DoctorEntity } from './entities/doctor.entity';

export interface IDoctorsRepository {
  create(doctor: DoctorEntity, userId: number, tx?: unknown): Promise<Doctor>;
  findAll(tx?: unknown): Promise<Doctor[]>;
  findOne(id: number, tx?: unknown): Promise<Doctor | null>;
  findByUserId(userId: number, tx?: unknown): Promise<Doctor | null>;
  update(id: number, doctor: DoctorEntity, tx?: unknown): Promise<Doctor>;
}
