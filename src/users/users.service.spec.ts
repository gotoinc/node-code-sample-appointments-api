import { ILogger } from 'src/common/interfaces/logger.interface';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { ResponseStatus } from 'src/common/service-response';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IEmailCredentialsRepository } from 'src/iam/authentication/email-credentials/email-credentials.repository.interface';
import { EmailCredentials, User } from '@prisma/client';

const getMockUser = (overrides: Partial<User>): User => {
  return {
    avatar: null,
    created_at: new Date(),
    email: 'email@gmail.com',
    first_name: 'First',
    id: 1,
    last_name: 'Last',
    updated_at: new Date(),
    user_role_id: 1,
    ...overrides,
  } as User;
};

const getMockCredentials = (
  overrides: Partial<EmailCredentials>,
): EmailCredentials => {
  return {
    id: 1,
    email: 'email@gmail.com',
    password_hash: 'password',
    user_id: 1,
    ...overrides,
  };
};

const mockLogger: jest.Mocked<ILogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockUsersRepository: jest.Mocked<IUsersRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  update: jest.fn(),
};

const mockRolesService: jest.Mocked<IRolesService> = {
  findByName: jest.fn(),
  findAll: jest.fn(),
};

const mockTransactionManager: ITransactionManager = {
  transaction: jest.fn(),
};

const mockEmailCredentialsRepository: jest.Mocked<IEmailCredentialsRepository> =
  {
    create: jest.fn(),
    updateEmail: jest.fn(),
    findOne: jest.fn(),
    updatePassword: jest.fn(),
  };

describe('UsersService', () => {
  let service: IUsersService;

  beforeEach(async () => {
    service = new UsersService(
      mockLogger,
      mockUsersRepository,
      mockRolesService,
      mockEmailCredentialsRepository,
      mockTransactionManager,
    );
  });

  describe('create', () => {
    it('should return error on roles service error', async () => {
      mockRolesService.findByName.mockResolvedValueOnce({
        error: { message: 'Error finding role' },
        data: null,
      });

      const user = await service.create({
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'doctor',
      });

      expect(user.error?.message).toBeTruthy();
    });

    it('should return error if role not found', async () => {
      mockRolesService.findByName.mockResolvedValueOnce({
        error: null,
        data: null,
      });

      const user = await service.create({
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'doctor',
      });

      expect(user.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return error if repository throws error', async () => {
      mockRolesService.findByName.mockResolvedValueOnce({
        error: null,
        data: {
          id: 1,
          name: 'doctor',
        },
      });
      mockUsersRepository.create.mockRejectedValueOnce('Error creating user');

      const user = await service.create({
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'doctor',
      });

      expect(user.error?.message).toBeTruthy();
    });

    it('should return success response', async () => {
      mockRolesService.findByName.mockResolvedValueOnce({
        error: null,
        data: {
          id: 1,
          name: 'doctor',
        },
      });

      mockUsersRepository.create.mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        user_role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        avatar: null,
      });

      const user = await service.create({
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'doctor',
      });

      expect(user.error).toBeNull();
      expect(user.data?.email).toBe('test@test.com');
    });
  });

  describe('findOne', () => {
    it('should return user by email', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        user_role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        user_role: {
          id: 1,
          role_name: 'doctor',
        },
        avatar: null,
      });

      const user = await service.findOne('test@test.com');

      expect(user.error).toBeNull();
      expect(user.data?.email).toBe('test@test.com');
    });

    it('should return not found if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);

      const user = await service.findOne('test@test.com');

      expect(user.data).toBeNull();
      expect(user.error?.status).not.toBeNull();
    });

    it('should return error if repository throws error', async () => {
      mockUsersRepository.findOne.mockRejectedValueOnce(
        new Error('Error finding user'),
      );

      const user = await service.findOne('test@test.com');

      expect(user.error?.message).not.toBeNull();
      expect(user.data).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      mockUsersRepository.findAll.mockResolvedValueOnce([
        {
          id: 1,
          email: 'test@test.com',
          first_name: 'John',
          last_name: 'Doe',
          user_role_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
          avatar: null,
        },
        {
          id: 2,
          email: 'test2@test.com',
          first_name: 'Jane',
          last_name: 'Doe',
          user_role_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
          avatar: null,
        },
      ]);

      const users = await service.findAll();

      expect(users.error).toBeNull();
      expect(users.data?.length).toBeGreaterThan(0);
    });

    it('should return error if repository throws error', async () => {
      mockUsersRepository.findAll.mockRejectedValueOnce(
        new Error('Error finding users'),
      );
      const users = await service.findAll();

      expect(users.error?.message).not.toBeNull();
      expect(users.data).toBeNull();
    });
  });
  describe('remove', () => {
    it('should return not found if user does not exist', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.remove(1, 'notfound@test.com');

      expect(result.data).toBeNull();
      expect(result.error?.status).toBe(ResponseStatus.NotFound);
      expect(result.error?.message).toBe('User not found');
    });

    it('should remove user and return success', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
        user_role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        user_role: { id: 1, role_name: 'doctor' },
        avatar: null,
      };
      mockUsersRepository.findOne.mockResolvedValueOnce(user);
      mockUsersRepository.remove.mockResolvedValueOnce(undefined as any);

      const result = await service.remove(1, 'test@test.com');

      expect(result.error).toBeNull();
      expect(result.data).toEqual(user);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith(1);
    });

    it('should return error if repository throws error', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        avatar: null,
        first_name: 'John',
        last_name: 'Doe',
        user_role_id: 1,
        user_role: {
          id: 1,
          role_name: 'doctor',
        },
        created_at: new Date(),
        updated_at: new Date(),
      });
      mockUsersRepository.remove.mockRejectedValueOnce(
        new Error('Remove failed'),
      );

      const result = await service.remove(1, 'test@test.com');

      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Remove failed');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
  describe('update', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const userId = 1;
    const updateUserDto = {
      email: 'newemail@test.com',
      first_name: 'New',
      last_name: 'Name',
    };

    it('should update user email with transaction and return success', async () => {
      const currentUser = getMockUser({});
      const currentUserCredentials = getMockCredentials({});

      mockUsersRepository.findById.mockResolvedValueOnce(currentUser);
      mockEmailCredentialsRepository.findOne
        .mockResolvedValueOnce(currentUserCredentials) // for currentUser email
        .mockResolvedValueOnce(null) // for updateUserDto.email
        .mockResolvedValueOnce(null); // for updateUserDto.email credentials

      const updatedUser = { ...currentUser, email: updateUserDto.email };
      (mockTransactionManager.transaction as jest.Mock).mockImplementationOnce(
        async (cb) => cb({}),
      );
      mockEmailCredentialsRepository.updateEmail.mockResolvedValueOnce(
        undefined as any,
      );
      mockUsersRepository.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result.error).toBeNull();
      expect(result.data?.email).toBe(updateUserDto.email);
      expect(mockEmailCredentialsRepository.updateEmail).toHaveBeenCalledWith(
        currentUser.email,
        updateUserDto.email,
      );
      expect(mockUsersRepository.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        expect.any(Object),
      );
    });

    it('should return not found if current user or credentials not found', async () => {
      mockUsersRepository.findById.mockResolvedValueOnce(null);
      mockEmailCredentialsRepository.findOne.mockResolvedValueOnce(null);

      const result = await service.update(userId, updateUserDto);

      expect(result.data).toBeNull();
      expect(result.error?.status).toBe(ResponseStatus.NotFound);
      expect(result.error?.message).toBe('User not found');
    });

    it('should return conflict if email already in use', async () => {
      const currentUser = getMockUser({});
      const currentUserCredentials = getMockCredentials({});
      const existingUser = getMockUser({ id: 2, email: updateUserDto.email });
      const existedUserCredentials = getMockCredentials({
        user_id: 2,
        email: updateUserDto.email,
      });

      mockUsersRepository.findById.mockResolvedValueOnce(currentUser);

      mockUsersRepository.findOne.mockResolvedValueOnce({
        ...existingUser,
        user_role: { id: 1, role_name: 'doctor' },
      });

      mockEmailCredentialsRepository.findOne
        .mockResolvedValueOnce(currentUserCredentials)
        .mockResolvedValueOnce(existedUserCredentials);

      const result = await service.update(userId, updateUserDto);

      expect(result.data).toBeNull();
      expect(result.error?.status).toBe(ResponseStatus.Conflict);
      expect(result.error?.message).toBe('Email already in use');
    });

    it('should update user without email change', async () => {
      const dto = { first_name: 'Updated', last_name: 'User' };
      const updatedUser = {
        id: userId,
        email: 'test@test.com',
        first_name: 'Updated',
        last_name: 'User',
        user_role_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
        avatar: null,
      };
      mockUsersRepository.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(userId, dto);

      expect(result.error).toBeNull();
      expect(result.data?.first_name).toBe('Updated');
      expect(mockUsersRepository.update).toHaveBeenCalledWith(userId, dto);
    });

    it('should return error if repository throws', async () => {
      mockUsersRepository.update.mockRejectedValueOnce(
        new Error('Update failed'),
      );

      const result = await service.update(userId, { first_name: 'Error' });

      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Update failed');
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });
});
