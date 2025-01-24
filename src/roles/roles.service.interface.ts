import { UserRole } from '@prisma/client';
import { IServiceResponse } from 'src/common/interfaces/service-response.interface';

export const RolesServiceSymbol = Symbol('ROLES_SERVICE');

export interface IRolesService {
  create(roleName: string): Promise<IServiceResponse<UserRole>>;
  findAll(): Promise<IServiceResponse<UserRole[]>>;
  findByName(roleName: string): Promise<IServiceResponse<UserRole>>;
}
