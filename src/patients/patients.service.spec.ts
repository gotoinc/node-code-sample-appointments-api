import { PatientsService } from './patients.service';
import { IPatientsRepository } from './patients.repository.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IPatientsService } from './patients.service.interface';
import { ResponseStatus } from 'src/common/service-response';

const mockLogger: jest.Mocked<ILogger> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

const mockPatientsRepository: jest.Mocked<IPatientsRepository> = {
  findByUserId: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
};

describe('PatientsService', () => {
  let service: IPatientsService;

  beforeEach(() => {
    service = new PatientsService(mockLogger, mockPatientsRepository);
  });

  describe('create', () => {
    it('should return conflict if patient already exists', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date(),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const patient = await service.create(
        { date_of_birth: '1990-01-01', gender: 'male', address: '123 Main St' },
        1,
      );

      expect(patient.error?.status).toBe(ResponseStatus.Conflict);
    });

    it('should return success response', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(null);

      mockPatientsRepository.create.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const patient = await service.create(
        { date_of_birth: '1990-01-01', gender: 'male', address: '123 Main St' },
        1,
      );

      expect(patient.error).toBeNull();
      expect(patient.data?.address).toBe('123 Main St');
    });

    it('should return error if repository throws error', async () => {
      mockPatientsRepository.findByUserId.mockRejectedValueOnce(
        'Error finding patient',
      );

      const patient = await service.create(
        { date_of_birth: '1990-01-01', gender: 'male', address: '123 Main St' },
        1,
      );

      expect(patient.data).toBeNull();
      expect(patient.error).not.toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      mockPatientsRepository.findAll.mockResolvedValueOnce([
        {
          id: 1,
          user_id: 1,
          date_of_birth: new Date('1990-01-01'),
          gender: 'male',
          address: '123 Main St',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          user_id: 2,
          date_of_birth: new Date('1990-01-02'),
          gender: 'female',
          address: '456 New St',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const patients = await service.findAll();

      expect(patients.error).toBeNull();
      expect(patients.data?.length).toBe(2);
    });

    it('should return error if repository throws error', async () => {
      mockPatientsRepository.findAll.mockRejectedValueOnce(
        'Error finding patients',
      );

      const patients = await service.findAll();

      expect(patients.data).toBeNull();
      expect(patients.error).not.toBeNull();
    });
  });

  describe('findById', () => {
    it('should return patient by id', async () => {
      mockPatientsRepository.findById.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const patient = await service.findById(1);

      expect(patient.error).toBeNull();
      expect(patient.data?.address).toBe('123 Main St');
    });

    it('should return error if repository throws error', async () => {
      mockPatientsRepository.findById.mockRejectedValueOnce(
        'Error finding patient',
      );

      const patient = await service.findById(1);

      expect(patient.data).toBeNull();
      expect(patient.error).not.toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should return patient by user id', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const patient = await service.findByUserId(1);

      expect(patient.error).toBeNull();
      expect(patient.data?.address).toBe('123 Main St');
    });

    it('should return error if repository throws error', async () => {
      mockPatientsRepository.findByUserId.mockRejectedValueOnce(
        'Error finding patient',
      );

      const patient = await service.findByUserId(1);

      expect(patient.data).toBeNull();
      expect(patient.error).not.toBeNull();
    });
  });

  describe('update', () => {
    it('should update a patient if they exist', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      mockPatientsRepository.update.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '456 New St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const patient = await service.update(
        { date_of_birth: '1990-01-01', gender: 'male', address: '456 New St' },
        1,
      );

      expect(patient.error).toBeNull();
      expect(patient.data?.address).toBe('456 New St');
    });

    it('should return error if repository find patient throws error', async () => {
      mockPatientsRepository.findByUserId.mockRejectedValueOnce(
        'Error finding patient',
      );

      const patient = await service.update(
        { date_of_birth: '1990-01-01', gender: 'male', address: '456 New St' },
        1,
      );

      expect(patient.data).toBeNull();
      expect(patient.error).not.toBeNull();
    });

    it('should return error if patient not found', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(null);

      const patient = await service.update(
        { date_of_birth: '1990-01-01', gender: 'male', address: '456 New St' },
        1,
      );

      expect(patient.data).toBeNull();
      expect(patient.error).not.toBeNull();
    });

    it('should return error if user does not match', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 2,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      const patient = await service.update(
        { date_of_birth: '1990-01-01', gender: 'male', address: '456 New St' },
        1,
      );

      expect(patient.error?.status).toBe(ResponseStatus.Forbidden);
    });

    it('should return error on update repository error', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce({
        id: 1,
        user_id: 1,
        date_of_birth: new Date('1990-01-01'),
        gender: 'male',
        address: '123 Main St',
        created_at: new Date(),
        updated_at: new Date(),
      });

      mockPatientsRepository.update.mockRejectedValueOnce(
        'Error updating patient',
      );

      const patient = await service.update(
        { date_of_birth: '1990-01-01', gender: 'male', address: '456 New St' },
        1,
      );

      expect(patient.data).toBeNull();
      expect(patient.error).not.toBeNull();
    });
  });
});
