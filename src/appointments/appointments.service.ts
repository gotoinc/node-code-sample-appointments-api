import { Appointment } from '@prisma/client';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IAppointmentsService } from './appointments.service.interface';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { IAppointmentsRepository } from './appointments.repository.interface';
import { IPatientsService } from 'src/patients/patients.service.interface';
import { IDoctorsService } from 'src/doctors/doctors.service.interface';
import { AppointmentEntity } from './entities/appointment.entity';
import { ITransactionManager } from 'src/common/interfaces/transaction-manager.interface';
import { ITimeslotsRepository } from 'src/timeslots/timeslots.repository.interface';

export class AppointmentsService implements IAppointmentsService {
  constructor(
    private readonly appointmentsRepository: IAppointmentsRepository,
    private readonly patientsService: IPatientsService,
    private readonly timeslotsRepository: ITimeslotsRepository,
    private readonly doctorsService: IDoctorsService,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async getById(id: number): Promise<IServiceResponse<Appointment>> {
    try {
      const appointment = await this.appointmentsRepository.findById(id);

      if (!appointment)
        return ServiceResponse.notFound('Appointment not found');

      return ServiceResponse.success<Appointment>(appointment);
    } catch (error) {
      console.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async getByDoctorId(
    doctorId: number,
  ): Promise<IServiceResponse<Appointment[]>> {
    try {
      const appointments =
        await this.appointmentsRepository.findByDoctorId(doctorId);

      return ServiceResponse.success<Appointment[]>(appointments);
    } catch (err) {
      console.error(err);
      return { error: { message: err.message }, data: null };
    }
  }

  async getByPatientId(
    patientId: number,
  ): Promise<IServiceResponse<Appointment[]>> {
    try {
      const appointments =
        await this.appointmentsRepository.findByPatientId(patientId);

      return ServiceResponse.success<Appointment[]>(appointments);
    } catch (err) {
      console.error(err);
      return { error: { message: err.message }, data: null };
    }
  }

  async create(
    appointment: CreateAppointmentDto,
    userId: number,
  ): Promise<IServiceResponse<Appointment>> {
    try {
      const { error: errorPatient, data: patient } =
        await this.patientsService.findByUserId(userId);

      if (errorPatient) return { error: errorPatient, data: null };
      if (!patient) return ServiceResponse.notFound('Patient not found');

      const { error: errorDoctor, data: doctor } =
        await this.doctorsService.findOne(appointment.doctor_id);

      if (errorDoctor) return { error: errorDoctor, data: null };
      if (!doctor) return ServiceResponse.notFound('Doctor not found');

      const timeslot = await this.timeslotsRepository.findById(
        appointment.timeslot_id,
      );

      if (!timeslot) return ServiceResponse.notFound('Timeslot not found');
      if (!timeslot.is_available)
        return ServiceResponse.forbidden('Timeslot is already taken');
      if (timeslot.fk_doctor_id !== doctor.id)
        return ServiceResponse.forbidden('Doctor does not match');

      const appointmentEntity: AppointmentEntity = {
        fullName: appointment.full_name,
        email: appointment.email,
        phoneNumber: appointment.phone_number,
        patientInsuranceNumber: appointment.patient_insurance_number,
        reason: appointment.reason,
        timeslotId: timeslot.id,
        doctorId: doctor.id,
        patientId: patient.id,
      };

      const createdAppointment = await this.transactionManager.transaction(
        async (tx) => {
          const createdAppointment = await this.appointmentsRepository.create(
            appointmentEntity,
            tx,
          );

          await this.timeslotsRepository.setUnavailable(timeslot.id);

          return createdAppointment;
        },
      );

      return ServiceResponse.success<Appointment>(createdAppointment);
    } catch (err) {
      console.error(err);
      return { error: { message: 'Error creating appointment' }, data: null };
    }
  }
}
