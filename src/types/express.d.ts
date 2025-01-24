import { AuthenticatedUser } from 'src/common/interfaces/authenticated-user.interface';

declare module 'express-serve-static-core' {
  export interface Request {
    user?: AuthenticatedUser;
  }
}
