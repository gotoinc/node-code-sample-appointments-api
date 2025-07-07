import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  ServiceUnavailableException,
  UsePipes,
} from '@nestjs/common';
import {
  ITemplateScheduleService,
  TemplateScheduleServiceSymbol,
} from './template_schedules.service.interface';
import {
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
} from '@nestjs/swagger';
import { DoctorIdParamDto } from 'src/timeslots/dto/doctor-id-param.dto';
import { TemplateSchedule } from '@prisma/client';
import { handleServiceError } from 'src/common/handle-service-error';
import {
  CreateTemplateScheduleDto,
  CreateTemplateScheduleSchema,
} from './dto/createTemplateSchedule.dto';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Request } from 'express';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('templates')
export class TemplateScheduleController {
  constructor(
    @Inject(TemplateScheduleServiceSymbol)
    private readonly templateScheduleService: ITemplateScheduleService,
  ) {}

  @ApiServiceUnavailableResponse({ description: 'Error finding template' })
  @Get('doctors/:doctorId')
  async getDoctorTemplates(
    @Param() { doctorId }: DoctorIdParamDto,
  ): Promise<TemplateSchedule[]> {
    const { error, data } =
      await this.templateScheduleService.findByDoctorId(doctorId);

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error finding templates');

    return data;
  }

  @ApiServiceUnavailableResponse({ description: 'Error creating template' })
  @ApiNotFoundResponse({ description: 'Doctor not found' })
  @Roles('doctor')
  @Post()
  @UsePipes(ZodValidationPipe)
  async createDoctorTimeslots(
    @Body() body: CreateTemplateScheduleDto,
    @Req() req: Request,
  ): Promise<TemplateSchedule> {
    const user = req.user!;
    console.log(
      CreateTemplateScheduleSchema.safeParse({
        name: 'test-template22',
        slotDuration: 60,
        schedule: {
          monday: {
            start_time: '25:00',
            end_time: '17:00',
          },
        },
      }),
    );

    const { error, data } = await this.templateScheduleService.create(
      body,
      user.userId,
    );

    const exception = handleServiceError(error);
    if (exception) throw exception;
    if (!data) throw new ServiceUnavailableException('Error creating template');

    return data;
  }
}
