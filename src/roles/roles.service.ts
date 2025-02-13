import { UserRole } from '@prisma/client';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IRolesRepository } from './roles.repository.interface';
import { IRolesService } from './roles.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { RoleDto } from './dto/role.dto';

export class RolesService implements IRolesService {
  constructor(
    private readonly logger: ILogger,
    private readonly rolesRepository: IRolesRepository,
  ) {}

  async findAll(): Promise<IServiceResponse<RoleDto[]>> {
    try {
      const allRoles: UserRole[] = await this.rolesRepository.findAll();

      return ServiceResponse.success<RoleDto[]>(
        allRoles.map((role) => ({
          id: role.id,
          name: role.role_name,
        })),
      );
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error finding all roles' }, data: null };
    }
  }

  async findByName(roleName: string): Promise<IServiceResponse<RoleDto>> {
    try {
      const role: UserRole | null =
        await this.rolesRepository.findByName(roleName);

      if (!role) return ServiceResponse.notFound('Role not found');

      return ServiceResponse.success<RoleDto>({
        id: role.id,
        name: role.role_name,
      });
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error finding role' }, data: null };
    }
  }

  // async create(roleName: string): Promise<IServiceResponse<RoleDto>> {
  //   try {
  //     const existingRole = await this.rolesRepository.findByName(roleName);

  //     if (existingRole) return ServiceResponse.conflict('Role already exists');

  //     const role = await this.rolesRepository.create(roleName);

  //     return ServiceResponse.success<RoleDto>({
  //       id: role.id,
  //       name: role.role_name,
  //     });
  //   } catch (error) {
  //     this.logger.error(error);
  //     return { error: { message: 'Error creating role' }, data: null };
  //   }
  // }
}
