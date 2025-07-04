import { AppointmentsService } from './appointments.service';
import { IAppointmentsService } from './appointments.service.interface';
import { ILogger } from 'src/common/interfaces/logger.interface';
import {
  AppointmentReturnType,
  IAppointmentsRepository,
} from './appointments.repository.interface';
import { ITimeslotsRepository } from 'src/timeslots/timeslots.repository.interface';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { IPatientsService } from 'src/patients/patients.service.interface';
import { ResponseStatus } from 'src/common/service-response';

function createMockAppointment(overrides = {}): AppointmentReturnType {
  return {
    declined_by_doctor: null,
    declined_by_patient: null,
    doctor: {
      id: 1,
      phone_number: '1234567890',
      licence_number: 'XYZ123',
      specialization_id: 1,
      user_id: 1,
    },
    patient: {
      id: 1,
      user_id: 1,
      address: 'address',
      date_of_birth: new Date(),
      gender: 'male',
      created_at: new Date(),
      updated_at: new Date(),
    },
    timeslot: {
      doctor_id: 1,
      end_time: new Date(),
      start_time: new Date(),
      id: 1,
      is_available: false,
    },
    doctor_id: 1,
    email: 'email@email.com',
    full_name: 'John Doe',
    id: 1,
    patient_id: 1,
    patient_insurance_number: '123123',
    phone_number: '123123213',
    reason: 'Reason',
    timeslot_id: 1,
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

const mockAppointmentsRepository: jest.Mocked<IAppointmentsRepository> = {
  findById: jest.fn(),
  findByDoctorId: jest.fn(),
  findByPatientId: jest.fn(),
  create: jest.fn(),
  declineByDoctor: jest.fn(),
  declineByPatient: jest.fn(),
};

const mockPatientsService: jest.Mocked<IPatientsService> = {
  findByUserId: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};

const mockTimeslotsRepository: jest.Mocked<ITimeslotsRepository> = {
  findById: jest.fn(),
  setUnavailable: jest.fn(),
  create: jest.fn(),
  findManyByDoctorId: jest.fn(),
  findCollisions: jest.fn(),
};

const mockDoctorsService: jest.Mocked<IDoctorsService> = {
  findOne: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

const mockTransactionManager: jest.Mocked<ITransactionManager> = {
  transaction: jest.fn(),
};

describe('AppointmentsService', () => {
  let service: IAppointmentsService;

  beforeEach(async () => {
    service = new AppointmentsService(
      mockLogger,
      mockAppointmentsRepository,
      mockPatientsService,
      mockTimeslotsRepository,
      mockDoctorsService,
      mockTransactionManager,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return appointment by id', async () => {
      mockAppointmentsRepository.findById.mockResolvedValueOnce(
        createMockAppointment(),
      );

      const appointment = await service.findById(1);

      expect(appointment.error).toBeNull();
      expect(appointment.data).not.toBeNull();
      expect(appointment.data!.id).toBe(1);
    });

    it('should return not found service response', async () => {
      mockAppointmentsRepository.findById.mockResolvedValueOnce(null);

      const appointment = await service.findById(1);

      expect(appointment.data).toBeNull();
      expect(appointment.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return service response with error on appointment repository error', async () => {
      mockAppointmentsRepository.findById.mockRejectedValueOnce(
        'Error finding appointment',
      );

      const appointment = await service.findById(1);

      expect(appointment.data).toBeNull();
      expect(appointment.error?.message).toBe('Error finding appointment');
    });
  });

  describe('findByDoctorId', () => {
    it('should find by doctor id', async () => {
      mockAppointmentsRepository.findByDoctorId.mockResolvedValueOnce([
        createMockAppointment(),
      ]);

      const appointments = await service.findByDoctorId(1);

      expect(appointments.error).toBeNull();
      expect(appointments.data).not.toBeNull();
      expect(appointments.data!.length).toBe(1);
      expect(appointments.data![0].id).toBe(1);
    });

    it('should return empty array data', async () => {
      mockAppointmentsRepository.findByDoctorId.mockResolvedValueOnce([]);

      const appointments = await service.findByDoctorId(1);

      expect(appointments.data?.length).toBe(0);
    });

    it('should return service response with error', async () => {
      mockAppointmentsRepository.findByDoctorId.mockRejectedValueOnce(
        'Error finding appointments',
      );

      const appointments = await service.findByDoctorId(1);

      expect(appointments.data).toBeNull();
      expect(appointments.error?.message).toBe('Error finding appointments');
    });
  });

  describe('findByPatientId', () => {
    it('should find by patient id', async () => {
      mockAppointmentsRepository.findByPatientId.mockResolvedValueOnce([
        createMockAppointment(),
      ]);

      const appointments = await service.findByPatientId(1);

      expect(appointments.error).toBeNull();
      expect(appointments.data).not.toBeNull();
      expect(appointments.data!.length).toBe(1);
      expect(appointments.data![0].id).toBe(1);
    });

    it('should return empty array data', async () => {
      mockAppointmentsRepository.findByPatientId.mockResolvedValueOnce([]);

      const appointments = await service.findByPatientId(1);

      expect(appointments.data?.length).toBe(0);
    });

    it('should return service response with error', async () => {
      mockAppointmentsRepository.findByPatientId.mockRejectedValueOnce(
        'Error finding appointments',
      );

      const appointments = await service.findByPatientId(1);

      expect(appointments.data).toBeNull();
      expect(appointments.error?.message).toBe('Error finding appointments');
    });
  });

  describe('create', () => {
    it('should return error finding patient', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error finding patient' },
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.message).toBe('Error finding patient');
    });

    it('should return error patient not found', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return error finding doctor', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          date_of_birth: new Date('2022-01-01'),
          gender: 'male',
          address: '123 Main St',
          user_id: 2,
          created_at: new Date('2022-01-01'),
          updated_at: new Date('2022-01-01'),
        },
        error: null,
      });

      mockDoctorsService.findOne.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error finding doctor' },
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.message).toBe('Error finding doctor');
    });

    it('should return error doctor not found', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          date_of_birth: new Date('2022-01-01'),
          gender: 'male',
          address: '123 Main St',
          user_id: 2,
          created_at: new Date('2022-01-01'),
          updated_at: new Date('2022-01-01'),
        },
        error: null,
      });

      mockDoctorsService.findOne.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.status).toBe(ResponseStatus.NotFound);
    });

    it('should return error finding timeslot', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          date_of_birth: new Date('2022-01-01'),
          gender: 'male',
          address: '123 Main St',
          user_id: 2,
          created_at: new Date('2022-01-01'),
          updated_at: new Date('2022-01-01'),
        },
        error: null,
      });

      mockDoctorsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          user_id: 3,
          licence_number: '1234567890',
          specialization_id: 2,
        },
        error: null,
      });

      mockTimeslotsRepository.findById.mockResolvedValueOnce(null);

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.status).toBe(ResponseStatus.NotFound);
      expect(appointment.error?.message).toBe('Timeslot not found');
    });

    it('should return forbidden error if slot is not available', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          date_of_birth: new Date('2022-01-01'),
          gender: 'male',
          address: '123 Main St',
          user_id: 2,
          created_at: new Date('2022-01-01'),
          updated_at: new Date('2022-01-01'),
        },
        error: null,
      });

      mockDoctorsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          user_id: 3,
          licence_number: '1234567890',
          specialization_id: 2,
        },
        error: null,
      });

      mockTimeslotsRepository.findById.mockResolvedValueOnce({
        id: 1,
        doctor_id: 1,
        start_time: new Date('2022-01-01'),
        end_time: new Date('2022-01-01'),
        is_available: false,
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.status).toBe(ResponseStatus.Forbidden);
    });

    it('should return forbidden error if doctor does not match', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          date_of_birth: new Date('2022-01-01'),
          gender: 'male',
          address: '123 Main St',
          user_id: 2,
          created_at: new Date('2022-01-01'),
          updated_at: new Date('2022-01-01'),
        },
        error: null,
      });

      mockDoctorsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          user_id: 3,
          licence_number: '1234567890',
          specialization_id: 2,
        },
        error: null,
      });

      mockTimeslotsRepository.findById.mockResolvedValueOnce({
        id: 1,
        doctor_id: 2,
        start_time: new Date('2022-01-01'),
        end_time: new Date('2022-01-01'),
        is_available: true,
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.status).toBe(ResponseStatus.Forbidden);
    });

    it('should return default error message on unexpected error', async () => {
      mockPatientsService.findByUserId.mockRejectedValueOnce(
        'Error finding patient',
      );

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error?.message).toBe('Error creating appointment');
    });

    it('should successfully create appointment', async () => {
      mockPatientsService.findByUserId.mockResolvedValueOnce({
        data: {
          id: 1,
          date_of_birth: new Date('2022-01-01'),
          gender: 'male',
          address: '123 Main St',
          user_id: 2,
          created_at: new Date('2022-01-01'),
          updated_at: new Date('2022-01-01'),
        },
        error: null,
      });

      mockDoctorsService.findOne.mockResolvedValueOnce({
        data: {
          id: 1,
          phone_number: '+1234567890',
          user_id: 3,
          licence_number: '1234567890',
          specialization_id: 2,
        },
        error: null,
      });

      mockTimeslotsRepository.findById.mockResolvedValueOnce({
        id: 1,
        doctor_id: 1,
        start_time: new Date('2022-01-01'),
        end_time: new Date('2022-01-01'),
        is_available: true,
      });

      mockTransactionManager.transaction.mockImplementationOnce(
        async (callback) => {
          return await callback(null);
        },
      );

      mockAppointmentsRepository.create.mockResolvedValueOnce(
        createMockAppointment({ email: 'john@doe.com' }),
      );

      mockTimeslotsRepository.setUnavailable.mockResolvedValueOnce({
        id: 1,
        doctor_id: 1,
        start_time: new Date(),
        end_time: new Date(),
        is_available: false,
      });

      const appointment = await service.create(
        {
          full_name: 'John Doe',
          email: 'john@doe.com',
          phone_number: '+1234567890',
          patient_insurance_number: '1234567890',
          reason: 'Test reason',
          timeslot_id: 1,
          doctor_id: 1,
        },
        1,
      );

      expect(appointment.error).toBeNull();
      expect(appointment.data?.email).toBe('john@doe.com');
    });
  });
});
