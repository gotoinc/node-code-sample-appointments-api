import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AUTH_TYPES } from './auth-types';
import { AUTH_TYPE_KEY } from './auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private static readonly defaultAuthType = AUTH_TYPES.Jwt;

  private readonly authTypeGuardMap = {
    [AUTH_TYPES.Jwt]: this.jwtAuthGuard,
    [AUTH_TYPES.None]: { canActivate: () => true },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) {
    console.log({
      reflector,
      jwtAuthGuard,
      canActivate: jwtAuthGuard.canActivate,
      authTypeGuardMap: this.authTypeGuardMap,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<
      (keyof typeof AUTH_TYPES)[]
    >(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ?? [
      AuthGuard.defaultAuthType,
    ];
    console.log({ authTypes });
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]);
    // .flat();

    let error = new UnauthorizedException();
    console.log({ guards });
    for (const instance of guards) {
      console.log({ instance });
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });
      if (canActivate) {
        return true;
      }
      throw error;
    }
  }
}
