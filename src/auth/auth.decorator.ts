import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPES } from './auth-types';

export const AUTH_TYPE_KEY = 'AUTH_TYPE_KEY';

export const Auth = (...authTypes: (keyof typeof AUTH_TYPES)[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
