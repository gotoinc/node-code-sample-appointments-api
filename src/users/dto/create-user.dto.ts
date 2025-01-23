import { ROLES } from 'src/iam/authorization/roles.constants';

export class CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role: keyof typeof ROLES;
}
