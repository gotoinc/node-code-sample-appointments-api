import { UserRole } from '@prisma/client';
import { IServiceResponse } from 'src/common/service-response.interface';
import { IRolesRepository } from './roles.repository.interface';
import { IRolesService } from './roles.service.interface';

export class RolesService implements IRolesService {
  constructor(private readonly rolesRepository: IRolesRepository) {}

  async create(roleName: string): Promise<IServiceResponse<UserRole>> {
    try {
      const existingRole = await this.rolesRepository.findByName(roleName);

      if (existingRole) {
        return { error: { message: 'Role already exists' }, data: null };
      }

      const role = await this.rolesRepository.create(roleName);

      return { error: null, data: role };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Role already exists' }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<UserRole[]>> {
    try {
      const allRoles: UserRole[] = await this.rolesRepository.findAll();

      return { error: null, data: allRoles };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding all roles' }, data: null };
    }
  }

  async findByName(roleName: string): Promise<IServiceResponse<UserRole>> {
    try {
      const role: UserRole = await this.rolesRepository.findByName(roleName);

      if (!role) {
        return { error: { message: 'Role not found' }, data: null };
      }

      return { error: null, data: role };
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding role' }, data: null };
    }
  }
}
