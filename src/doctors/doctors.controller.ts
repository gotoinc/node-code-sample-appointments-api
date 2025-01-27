import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import {
  DoctorsServiceSymbol,
  IDoctorsService,
} from './doctors.service.interface';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { Request } from 'express';
import { handleServiceError } from 'src/common/handle-service-error';

@Auth('Jwt')
@Controller('doctors')
export class DoctorsController {
  constructor(
    @Inject(DoctorsServiceSymbol)
    private readonly doctorsService: IDoctorsService,
  ) {}

  @Roles('doctor')
  @Post()
  async create(@Body() body: CreateDoctorDto, @Req() req: Request) {
    const user = req.user!;
    const { error, data } = await this.doctorsService.create(body, user.userId);
    if (error) throw new BadRequestException(error.message);

    return data;
  }

  @Get()
  async findAll() {
    const { error, data } = await this.doctorsService.findAll();
    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }

  @Roles('doctor')
  @Get('me')
  async findDoctorsProfileOfUser(@Req() req: Request) {
    const user = req.user!;
    const { error, data } = await this.doctorsService.findByUserId(user.userId);
    if (!data) throw new NotFoundException('Doctor not found');
    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }

  @Get(':id')
  async findOne(@Param() { id }: IdParamDto) {
    const { error, data } = await this.doctorsService.findOne(id);
    if (!data) throw new NotFoundException('Doctor not found');
    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }

  @Roles('doctor')
  @Put('me')
  async update(@Body() body: UpdateDoctorDto, @Req() req: Request) {
    const user = req.user!;

    const { error, data } = await this.doctorsService.update(body, user.userId);

    const exception = handleServiceError(error);
    if (exception) throw exception;

    return data;
  }
}
