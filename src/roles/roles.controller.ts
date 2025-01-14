import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(
    @Inject('ROLES_SERVICE') private readonly rolesService: RolesService,
  ) {}

  @Post()
  async create(@Body() body: CreateRoleDto) {
    const { error: errorCreateRole, data: createdRole } =
      await this.rolesService.create(body.role_name);
    if (errorCreateRole) {
      throw new BadRequestException(errorCreateRole.message);
    }
    return createdRole;
  }

  @Get()
  async findAll() {
    const { error: errorFindAll, data: allRoles } =
      await this.rolesService.findAll();
    if (errorFindAll) {
      throw new ServiceUnavailableException(errorFindAll.message);
    }
    return allRoles;
  }
}
