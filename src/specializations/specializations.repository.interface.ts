import { Specialization } from '@prisma/client';
import { SpecializationEntity } from './entities/specialization.entity';

export interface ISpecializationsRepository {
  findAll(tx?: unknown): Promise<Specialization[]>;
  findOne(id: number, tx?: unknown): Promise<Specialization>;
  findByName(name: string, tx?: unknown): Promise<Specialization>;
  create(
    specialization: SpecializationEntity,
    tx?: unknown,
  ): Promise<Specialization>;
}
