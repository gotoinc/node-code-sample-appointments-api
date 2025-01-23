export const HashingServiceSymbol = Symbol('HASHING_SERVICE');

export interface IHashingService {
  hash(password: string): string;
  verify(password: string, hash: string): boolean;
}
