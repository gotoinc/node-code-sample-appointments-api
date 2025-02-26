import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IRolesService, RolesServiceSymbol } from './roles.service.interface';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { RoleDto } from './dto/role.dto';
import { ApiServiceUnavailableResponse } from '@nestjs/swagger';

@Auth('Jwt')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject(RolesServiceSymbol) private readonly rolesService: IRolesService,
  ) {}

  @ApiServiceUnavailableResponse({ description: 'Error finding all roles' })
  @Get()
  async findAll(): Promise<RoleDto[]> {
    const { error: errorFindAll, data: allRoles } =
      await this.rolesService.findAll();

    if (errorFindAll || !allRoles)
      throw new ServiceUnavailableException('Error finding all roles');

    return allRoles;
  }
}
