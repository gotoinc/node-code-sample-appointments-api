import { AuthProvider } from '@prisma/client';

export interface IAuthProvidersRepository {
  findOne(authProviderName: string, tx?: unknown): Promise<AuthProvider>;
  create(authProviderName: string, tx?: unknown): Promise<AuthProvider>;
}
