import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../roles.constants';

export const ROLES_KEY = 'ROLES';

export const Roles = (...roles: (keyof typeof ROLES)[]) =>
  SetMetadata(ROLES_KEY, roles);
