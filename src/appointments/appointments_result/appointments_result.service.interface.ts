import { IServiceResponse } from 'src/common/service-response';
import { AddAppointmentResultDto } from '../dto/add-appointment-result.dto';
import { AppointmentResultDto } from '../dto/appointment-result.dto';

export const AppointmentsResultServiceSymbol = Symbol(
  'APPOINTMENTS_RESULT_SERVICE',
);

export interface IAppointmentsResultService {
  create(
    appointmentResult: AddAppointmentResultDto,
  ): Promise<IServiceResponse<AppointmentResultDto>>;
}
