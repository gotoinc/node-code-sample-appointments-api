import * as crypto from 'node:crypto';
import { IHashingService } from './hashing.service.interface';

export class HashingService implements IHashingService {
  hash(password: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');
    return `${hash}:${salt}`;
  }

  verify(password: string, hashedPassword: string) {
    try {
      const [hash, salt] = hashedPassword.split(':');
      const isPasswordValid =
        crypto
          .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
          .toString('hex') === hash;
      return isPasswordValid;
    } catch {
      return false;
    }
  }
}
