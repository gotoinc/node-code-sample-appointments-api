import { UserRole } from '@prisma/client';

export interface IRolesRepository {
  findByName(name: string, tx?: unknown): Promise<UserRole>;
}
