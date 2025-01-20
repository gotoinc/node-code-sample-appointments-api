import {
  Controller,
  Inject,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IUsersService, UsersServiceSymbol } from './users.service.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    const { error, data: users } = await this.usersService.getUsers();
    if (error) {
      throw new ServiceUnavailableException(error.message);
    }
    return users;
  }
}
