import { IServiceResponse } from 'src/common/service-response';
import { RoleDto } from './dto/role.dto';

export const RolesServiceSymbol = Symbol('ROLES_SERVICE');

export interface IRolesService {
  findAll(): Promise<IServiceResponse<RoleDto[]>>;
  findByName(roleName: string): Promise<IServiceResponse<RoleDto>>;
  // create(roleName: string): Promise<IServiceResponse<RoleDto>>;
}
