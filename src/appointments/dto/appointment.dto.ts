import { DoctorDto } from 'src/doctors/dto/doctor.dto';
import { PatientDto } from 'src/patients/dto/patient.dto';
import { TimeslotDto } from 'src/timeslots/dto/timeslot.dto';

export class AppointmentDto {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  patient_insurance_number: string;
  reason: string;
  timeslot_id: number;
  doctor_id: number;
  patient: PatientDto;
  doctor: DoctorDto;
  timeslot: TimeslotDto;
}
