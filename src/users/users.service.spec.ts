import { ILogger } from 'src/common/interfaces/logger.interface';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { ResponseStatus } from 'src/common/service-response';

const mockLogger: jest.Mocked<ILogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockUsersRepository: jest.Mocked<IUsersRepository> = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockRolesService: jest.Mocked<IRolesService> = {
  findByName: jest.fn(),
  findAll: jest.fn(),
  // create: jest.fn(),
};

describe('RolesService', () => {
  let service: IUsersService;

  beforeEach(async () => {
    service = new UsersService(
      mockLogger,
      mockUsersRepository,
      mockRolesService,
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
        },
        {
          id: 2,
          email: 'test2@test.com',
          first_name: 'Jane',
          last_name: 'Doe',
          user_role_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
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
});
