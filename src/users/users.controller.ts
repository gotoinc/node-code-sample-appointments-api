import { Controller, Inject } from '@nestjs/common';
import { IUsersService, UsersServiceSymbol } from './users.service.interface';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';

@Auth('Jwt')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
  ) {}
}
