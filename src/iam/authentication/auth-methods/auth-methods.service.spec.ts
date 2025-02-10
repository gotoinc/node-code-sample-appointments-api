import { ResponseStatus } from 'src/common/service-response';
import { AuthMethodsService } from './auth-methods.service';
import { UserAuthMethod } from '@prisma/client';

const loggerMock = { error: jest.fn() };
const transactionManagerMock = { transaction: jest.fn() };
const rolesServiceMock = { findByName: jest.fn() };
const usersRepositoryMock = { create: jest.fn() };
const authMethodsRepositoryMock = { create: jest.fn(), findOne: jest.fn() };
const authProvidersServiceMock = { findOne: jest.fn() };

describe('AuthMethodsService', () => {
  let service: AuthMethodsService;

  beforeEach(() => {
    service = new AuthMethodsService(
      loggerMock as any,
      transactionManagerMock as any,
      rolesServiceMock as any,
      usersRepositoryMock as any,
      authMethodsRepositoryMock as any,
      authProvidersServiceMock as any,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewUser', () => {
    it('should return error if role is not found', async () => {
      rolesServiceMock.findByName.mockResolvedValue({
        error: 'Role not found',
        data: null,
      });

      const result = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'google',
      );

      expect(result).toEqual({ error: 'Role not found', data: null });
    });

    it('should return error if auth provider is not found', async () => {
      rolesServiceMock.findByName.mockResolvedValue({
        error: null,
        data: { id: 1 },
      });
      authProvidersServiceMock.findOne.mockResolvedValue({
        error: 'Provider not found',
        data: null,
      });

      const result = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'google',
      );

      expect(result).toEqual({ error: 'Provider not found', data: null });
    });

    it('should create a new user and return success response', async () => {
      rolesServiceMock.findByName.mockResolvedValue({
        error: null,
        data: { id: 1 },
      });
      authProvidersServiceMock.findOne.mockResolvedValue({
        error: null,
        data: { id: 2 },
      });
      usersRepositoryMock.create.mockResolvedValue({
        id: 3,
        email: 'test@example.com',
      });
      authMethodsRepositoryMock.create.mockResolvedValue({
        id: 4,
        userId: 3,
        authProviderId: 2,
      });
      transactionManagerMock.transaction.mockImplementation(async (fn) => fn());

      const result = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'google',
      );

      expect(result).toEqual({
        error: null,
        data: { id: 4, userId: 3, authProviderId: 2 },
      });
    });

    it('should return error if transaction fails', async () => {
      rolesServiceMock.findByName.mockResolvedValue({
        error: null,
        data: { id: 1 },
      });
      authProvidersServiceMock.findOne.mockResolvedValue({
        error: null,
        data: { id: 2 },
      });
      transactionManagerMock.transaction.mockRejectedValue(
        new Error('Transaction failed'),
      );

      const result = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'google',
      );

      expect(loggerMock.error).toHaveBeenCalledWith(
        new Error('Transaction failed'),
      );
      expect(result).toEqual({
        error: { message: 'Error creating user' },
        data: null,
      });
    });
  });

  describe('findOne', () => {
    it('should return not found error if user auth method does not exist', async () => {
      authMethodsRepositoryMock.findOne.mockResolvedValue(null);

      const result = await service.findOne('test@example.com');

      expect(result.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return success response if user auth method exists', async () => {
      const userAuthMethod: UserAuthMethod = {
        id: 1,
        user_id: 2,
        auth_provider_id: 3,
        email: 'test@example.com',
      };
      authMethodsRepositoryMock.findOne.mockResolvedValue(userAuthMethod);

      const result = await service.findOne('test@example.com');

      expect(result).toEqual({ error: null, data: userAuthMethod });
    });

    it('should return error if repository call fails', async () => {
      authMethodsRepositoryMock.findOne.mockRejectedValue(
        new Error('DB error'),
      );

      const result = await service.findOne('test@example.com');

      expect(loggerMock.error).toHaveBeenCalledWith(new Error('DB error'));
      expect(result).toEqual({
        error: { message: 'Error finding user' },
        data: null,
      });
    });
  });
});
