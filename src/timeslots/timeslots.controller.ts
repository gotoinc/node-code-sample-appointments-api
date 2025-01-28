import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import {
  ITimeslotsService,
  TimeslotsServiceSymbol,
} from './timeslots.service.interface';
import { handleServiceError } from 'src/common/handle-service-error';
import { DoctorIdParamDto } from './dto/doctor-id-param.dto';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { Request } from 'express';

@Controller('timeslots')
export class TimeslotsController {
  constructor(
    @Inject(TimeslotsServiceSymbol)
    private readonly timeslotsService: ITimeslotsService,
  ) {}

  @Get('doctors:doctorId')
  async getDoctorTimeslots(@Param() { doctorId }: DoctorIdParamDto) {
    const { error, data } =
      await this.timeslotsService.findByDoctorId(doctorId);

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }

  @Roles('doctor')
  @Post()
  async createDoctorTimeslots(
    @Body() body: CreateTimeslotDto,
    @Req() req: Request,
  ) {
    const user = req.user!;

    const { error, data } = await this.timeslotsService.create(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }
}
