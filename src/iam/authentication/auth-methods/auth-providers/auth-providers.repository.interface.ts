import { AuthProvider } from '@prisma/client';

export interface IAuthProvidersRepository {
  findOne(authProviderName: string, tx?: unknown): Promise<AuthProvider | null>;
  create(authProviderName: string, tx?: unknown): Promise<AuthProvider>;
}
