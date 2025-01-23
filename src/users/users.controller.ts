import {
  Controller,
  Inject,
  // ServiceUnavailableException,
} from '@nestjs/common';
// import { Get } from '@nestjs/common';
import { IUsersService, UsersServiceSymbol } from './users.service.interface';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';

@Auth('Jwt')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
  ) {}

  // @Get()
  // async getUsers() {
  //   const { error, data: users } = await this.usersService.getUsers();
  //   if (error) {
  //     throw new ServiceUnavailableException(error.message);
  //   }
  //   return users;
  // }
}
