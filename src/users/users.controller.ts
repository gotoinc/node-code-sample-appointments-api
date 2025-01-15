import {
  Controller,
  Inject,
  ServiceUnavailableException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Request() req) {
    console.log(req.user);
    const { error, data: users } = await this.usersService.getUsers();
    if (error) {
      throw new ServiceUnavailableException(error.message);
    }
    return users;
  }
}
