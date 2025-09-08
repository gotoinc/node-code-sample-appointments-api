import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IUsersService, UsersServiceSymbol } from './users.service.interface';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import Multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Auth('Jwt')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersServiceSymbol) private readonly usersService: IUsersService,
  ) {}

  @Get('me')
  async findOne(@Req() req: Request) {
    const user = req.user!;
    const { error, data } = await this.usersService.findOne(user.email);
    if (error) throw error;
    if (!data) throw new Error('User not found');

    return data;
  }

  @Put('me')
  async update(@Req() req: Request, @Body() body: UpdateUserDto) {
    const user = req.user!;
    const { error, data } = await this.usersService.update(user.userId, body);
    if (error) throw error;
    if (!data) throw new Error('User not found');

    return data;
  }

  @Delete('me')
  async remove(@Req() req: Request) {
    const user = req.user!;
    const { userId: id, email } = user;

    const { error, data } = await this.usersService.remove(id, email);

    if (error) throw error;
    if (!data) throw new Error('User not found');

    return data;
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@Req() req: Request, @UploadedFile() file: Multer.File) {
    const user = req.user!;
    console.log('file', file);
    const { error, data } = await this.usersService.uploadAvatar(
      user.userId,
      file,
    );
    if (error) throw error;
    if (!data) throw new Error('User not found');

    return { avatarUrl: data };
  }
}
