import {
  Controller,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @Post()
  async createUser(@Body() user: any) {
    return this.usersService.create(user);
  }

  @Get()
  async getUsers() {
    const { error, data: users } = await this.usersService.getUsers();
    if (error) {
      throw new ServiceUnavailableException(error.message);
    }
    return users;
  }
}
