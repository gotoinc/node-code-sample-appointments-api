import { Specialization } from '@prisma/client';
import { SpecializationEntity } from './entities/specialization.entity';

export interface ISpecializationsRepository {
  findAll(tx?: unknown): Promise<Specialization[]>;
  findOne(id: number, tx?: unknown): Promise<Specialization | null>;
  findByName(name: string, tx?: unknown): Promise<Specialization | null>;
  create(
    specialization: SpecializationEntity,
    tx?: unknown,
  ): Promise<Specialization>;
}
