import { UserRole } from '@prisma/client';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IRolesRepository } from './roles.repository.interface';
import { IRolesService } from './roles.service.interface';

export class RolesService implements IRolesService {
  constructor(private readonly rolesRepository: IRolesRepository) {}

  async create(roleName: string): Promise<IServiceResponse<UserRole>> {
    try {
      const existingRole = await this.rolesRepository.findByName(roleName);

      if (existingRole) return ServiceResponse.conflict('Role already exists');

      const role = await this.rolesRepository.create(roleName);

      return ServiceResponse.success<UserRole>(role);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error creating role' }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<UserRole[]>> {
    try {
      const allRoles: UserRole[] = await this.rolesRepository.findAll();

      return ServiceResponse.success<UserRole[]>(allRoles);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding all roles' }, data: null };
    }
  }

  async findByName(roleName: string): Promise<IServiceResponse<UserRole>> {
    try {
      const role: UserRole | null =
        await this.rolesRepository.findByName(roleName);

      if (!role) return ServiceResponse.notFound('Role not found');

      return ServiceResponse.success<UserRole>(role);
    } catch (error) {
      console.error(error);
      return { error: { message: 'Error finding role' }, data: null };
    }
  }
}
