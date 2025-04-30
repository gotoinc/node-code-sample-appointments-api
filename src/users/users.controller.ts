import { Controller, Get, Inject, Req } from '@nestjs/common';
import { IUsersService, UsersServiceSymbol } from './users.service.interface';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { Request } from 'express';

@Auth('Jwt')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
  ) {}

  @Get('me')
  async findOne(@Req() req: Request) {
    const user = req.user!;
    const { error, data } = await this.usersService.findOne(user.email);
    if (error) throw error;
    if (!data) throw new Error('User not found');

    return data;
  }
}
