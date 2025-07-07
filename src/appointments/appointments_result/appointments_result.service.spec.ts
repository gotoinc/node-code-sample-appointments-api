import { ILogger } from 'src/common/interfaces/logger.interface';
import { AppointmentsResultService } from './appointments_result.service';
import { IAppointmentsResultRepository } from './appointments_result.repository.interface';
import {
  AppointmentReturnType,
  IAppointmentsRepository,
} from '../appointments.repository.interface';
import { IAppointmentsResultService } from './appointments_result.service.interface';

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
  decline: jest.fn(),
};

const mockAppointmentsResultRepository: jest.Mocked<IAppointmentsResultRepository> =
  {
    create: jest.fn(),
    findByAppointmentId: jest.fn(),
  };

describe('AppointmentsResultService', () => {
  let service: IAppointmentsResultService;

  beforeEach(async () => {
    service = new AppointmentsResultService(
      mockLogger,
      mockAppointmentsResultRepository,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should add result and return success', async () => {
      const appointment = createMockAppointment();
      const appointmentResult = {
        id: 1,
        appointmentId: appointment.id,
        diagnosis: 'Diagnosis',
        recommendations: 'Recommendations',
      };
      const appointmentWithResult = {
        appointment: appointment,
        diagnosis: appointmentResult.diagnosis,
        recommendations: appointmentResult.recommendations,
        appointment_id: appointmentResult.appointmentId,
        id: appointmentResult.id,
      };

      mockAppointmentsRepository.findById.mockResolvedValueOnce(appointment);
      mockAppointmentsResultRepository.create.mockResolvedValueOnce(
        appointmentWithResult,
      );

      const result = await service.create(appointmentResult);

      expect(result.error).toBeNull();
      expect(result.data).not.toBeNull();
      expect(result.data?.diagnosis).toBe('Diagnosis');
      expect(result.data?.recommendations).toBe('Recommendations');
    });
  });
});
