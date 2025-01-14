import { Controller } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: any) {
    return this.usersService.createUser(user);
  }

  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }
}
