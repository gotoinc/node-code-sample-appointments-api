import { SetMetadata } from '@nestjs/common';
import { ROLES } from './roles';

export const ROLES_KEY = 'ROLES_KEY';

export const Roles = (...roles: (keyof typeof ROLES)[]) =>
  SetMetadata(ROLES_KEY, roles);
