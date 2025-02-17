import {
  // BadRequestException,
  // Body,
  Controller,
  Get,
  Inject,
  // Post,
  ServiceUnavailableException,
} from '@nestjs/common';
// import { CreateRoleDto } from './dto/create-role.dto';
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

  // @Post()
  // async create(@Body() body: CreateRoleDto) {
  //   const { error: errorCreateRole, data: createdRole } =
  //     await this.rolesService.create(body.role_name);
  //   if (errorCreateRole) {
  //     throw new BadRequestException(errorCreateRole.message);
  //   }
  //   return createdRole;
  // }
}
