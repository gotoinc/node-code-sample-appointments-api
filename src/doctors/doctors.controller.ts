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
  UnauthorizedException,
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
    const user = req.user;
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
    const user = req.user;
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
  @Put(':id')
  async update(
    @Param() { id }: IdParamDto,
    @Body() body: UpdateDoctorDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    const { error: errorFindDoctor, data: doctor } =
      await this.doctorsService.findOne(id);
    if (errorFindDoctor)
      throw new ServiceUnavailableException(errorFindDoctor.message);
    if (user.userId !== doctor.fk_user_id)
      throw new UnauthorizedException('Unauthorized');

    const { error, data } = await this.doctorsService.update(id, body);
    if (error) throw new ServiceUnavailableException(error.message);

    return data;
  }
}
