import { PatientsService } from './patients.service';
import {
  IPatientsRepository,
  PatientReturnType,
} from './patients.repository.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IPatientsService } from './patients.service.interface';
import { ResponseStatus } from 'src/common/service-response';

function createMockPatient(overrides = {}): PatientReturnType {
  return {
    id: 1,
    user_id: 1,
    address: 'address',
    date_of_birth: new Date(),
    gender: 'male',
    user: {
      user_role_id: 1,
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'patient@test.com',
      created_at: new Date(),
      updated_at: new Date(),
    },
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
}

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
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(
        createMockPatient(),
      );

      const patient = await service.create(
        { date_of_birth: '1990-01-01', gender: 'male', address: '123 Main St' },
        1,
      );

      expect(patient.error?.status).toBe(ResponseStatus.Conflict);
    });

    it('should return success response', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(null);

      mockPatientsRepository.create.mockResolvedValueOnce(
        createMockPatient({ address: '123 Main St' }),
      );

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
        createMockPatient({ id: 1, user_id: 1, address: '123 Main St' }),
        createMockPatient({ id: 2, user_id: 2, address: '456 New St' }),
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
      mockPatientsRepository.findById.mockResolvedValueOnce(
        createMockPatient({ id: 1, address: '123 Main St' }),
      );

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
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(
        createMockPatient({ user_id: 1, address: '123 Main St' }),
      );

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
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(
        createMockPatient(),
      );

      mockPatientsRepository.update.mockResolvedValueOnce(
        createMockPatient({ address: '456 New St' }),
      );

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
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(
        createMockPatient({ user_id: 2 }),
      );

      const patient = await service.update(
        { date_of_birth: '1990-01-01', gender: 'male', address: '456 New St' },
        1,
      );

      expect(patient.error?.status).toBe(ResponseStatus.Forbidden);
    });

    it('should return error on update repository error', async () => {
      mockPatientsRepository.findByUserId.mockResolvedValueOnce(
        createMockPatient(),
      );

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
