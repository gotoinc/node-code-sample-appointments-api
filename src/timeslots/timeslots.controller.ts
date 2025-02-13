import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
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
import { FromToQueryDto } from './dto/from-to-query.dto';
import { TimeslotDto } from './dto/timeslot.dto';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';

@Controller('timeslots')
export class TimeslotsController {
  constructor(
    @Inject(TimeslotsServiceSymbol)
    private readonly timeslotsService: ITimeslotsService,
  ) {}

  @ApiServiceUnavailableResponse({ description: 'Error finding timeslots' })
  @Get('doctors/:doctorId')
  async getDoctorTimeslots(
    @Param() { doctorId }: DoctorIdParamDto,
    @Query() query: FromToQueryDto,
  ): Promise<TimeslotDto[]> {
    const { error, data } = await this.timeslotsService.findByDoctorId(
      doctorId,
      { from: query.from, to: query.to },
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error finding timeslots');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error creating timeslot' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @ApiConflictResponse({ description: 'Timeslots collision' })
  @Roles('doctor')
  @Post()
  async createDoctorTimeslots(
    @Body() body: CreateTimeslotDto,
    @Req() req: Request,
  ): Promise<TimeslotDto> {
    const user = req.user!;

    const { error, data } = await this.timeslotsService.create(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error creating timeslot');

    return data;
  }
}
