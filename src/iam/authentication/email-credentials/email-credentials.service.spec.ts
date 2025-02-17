import { EmailCredentialsService } from './email-credentials.service';
import { IUsersRepository } from 'src/users/users.repository.interface';
import { IEmailCredentialsRepository } from 'src/iam/authentication/email-credentials/email-credentials.repository.interface';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { ServiceResponse } from 'src/common/service-response';
import { EmailCredentials, User } from '@prisma/client';

describe('EmailCredentialsService', () => {
  let service: EmailCredentialsService;
  let usersRepository: jest.Mocked<IUsersRepository>;
  let emailCredentialsRepository: jest.Mocked<IEmailCredentialsRepository>;
  let transactionManager: jest.Mocked<ITransactionManager>;
  let rolesService: jest.Mocked<IRolesService>;
  let logger: jest.Mocked<ILogger>;

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
    } as any;

    emailCredentialsRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
    } as any;

    transactionManager = {
      transaction: jest.fn((callback) => callback({})),
    } as any;

    rolesService = {
      findByName: jest.fn(),
    } as any;

    logger = {
      error: jest.fn(),
    } as any;

    service = new EmailCredentialsService(
      logger,
      transactionManager,
      usersRepository,
      emailCredentialsRepository,
      rolesService,
    );
  });

  describe('createNewUser', () => {
    it('should create a new user successfully', async () => {
      const role = { id: 1, name: 'patient' };
      const user: User = {
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        user_role_id: role.id,
        created_at: new Date(),
        updated_at: new Date(),
      };

      rolesService.findByName.mockResolvedValue(ServiceResponse.success(role));
      usersRepository.create.mockResolvedValue(user);
      emailCredentialsRepository.create.mockResolvedValue(
        {} as EmailCredentials,
      );

      const response = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'hashedpassword',
      );

      expect(response).toEqual(ServiceResponse.success(user));
      expect(rolesService.findByName).toHaveBeenCalledWith('admin');
      expect(usersRepository.create).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          roleId: role.id,
        },
        expect.any(Object),
      );
      expect(emailCredentialsRepository.create).toHaveBeenCalledWith(
        {
          email: 'test@example.com',
          passwordHash: 'hashedpassword',
          userId: user.id,
        },
        expect.any(Object),
      );
    });

    it('should return an error if role not found', async () => {
      rolesService.findByName.mockResolvedValue({
        error: { message: 'Role not found' },
        data: null,
      });

      const response = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'hashedpassword',
      );

      expect(response).toEqual({
        error: { message: 'Role not found' },
        data: null,
      });
    });

    it('should return an error if transaction fails', async () => {
      rolesService.findByName.mockResolvedValue(
        ServiceResponse.success({ id: 1, name: 'patient' }),
      );
      transactionManager.transaction.mockRejectedValue(
        new Error('Transaction failed'),
      );

      const response = await service.createNewUser(
        'test@example.com',
        'John',
        'Doe',
        'admin',
        'hashedpassword',
      );

      expect(response).toEqual({
        error: { message: 'Transaction failed' },
        data: null,
      });
      expect(logger.error).toHaveBeenCalledWith(
        new Error('Transaction failed'),
      );
    });
  });

  describe('findOne', () => {
    it('should return email credentials if found', async () => {
      const emailCredentials: EmailCredentials = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        user_id: 1,
      };
      emailCredentialsRepository.findOne.mockResolvedValue(emailCredentials);

      const response = await service.findOne('test@example.com');

      expect(response).toEqual(ServiceResponse.success(emailCredentials));
      expect(emailCredentialsRepository.findOne).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should return not found error if email credentials do not exist', async () => {
      emailCredentialsRepository.findOne.mockResolvedValue(null);

      const response = await service.findOne('test@example.com');

      expect(response).toEqual(ServiceResponse.notFound('Email not found'));
    });

    it('should return an error if repository throws', async () => {
      emailCredentialsRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      const response = await service.findOne('test@example.com');

      expect(response).toEqual({
        error: { message: 'Error finding email credentials' },
        data: null,
      });
      expect(logger.error).toHaveBeenCalledWith(new Error('Database error'));
    });
  });
});
