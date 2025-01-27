import { UserRole } from '@prisma/client';

export interface IRolesRepository {
  findByName(name: string, tx?: unknown): Promise<UserRole | null>;
  create(roleName: string, tx?: unknown): Promise<UserRole>;
  findAll(tx?: unknown): Promise<UserRole[]>;
}
