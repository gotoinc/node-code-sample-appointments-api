import { User, UserRole } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IUsersService } from './users.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { IRolesService } from 'src/roles/roles.service.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import Multer from 'multer';
import { IMinioService } from 'src/minio-module/minio.service.interface';

export class UsersService implements IUsersService {
  constructor(
    private readonly logger: ILogger,
    private readonly usersRepository: IUsersRepository,
    private readonly rolesService: IRolesService,
    private readonly minioService: IMinioService,
  ) {}

  async create(user: CreateUserDto): Promise<IServiceResponse<User>> {
    try {
      const { error: errorRole, data: role } =
        await this.rolesService.findByName(user.role);

      if (errorRole) return { error: errorRole, data: null };
      if (!role) return ServiceResponse.notFound('Role not found');

      const userEntity: UserEntity = {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        roleId: role.id,
      };

      const createdUser = await this.usersRepository.create(userEntity);

      return ServiceResponse.success<User>(createdUser);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error creating user' }, data: null };
    }
  }

  async findOne(
    email: string,
  ): Promise<IServiceResponse<User & { user_role: UserRole }>> {
    try {
      const user = await this.usersRepository.findOne(email);

      if (!user) return { error: null, data: null };

      return ServiceResponse.success<User & { user_role: UserRole }>(user);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async findAll(): Promise<IServiceResponse<User[]>> {
    try {
      const users: User[] = await this.usersRepository.findAll();

      return ServiceResponse.success<User[]>(users);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<IServiceResponse<User>> {
    try {
      if (updateUserDto.email) {
        const existingUser = await this.usersRepository.findOne(
          updateUserDto.email,
        );

        if (existingUser && existingUser.id !== id) {
          return { error: { message: 'Email already in use' }, data: null };
        }
      }

      const updatedUser = await this.usersRepository.update(id, updateUserDto);
      return ServiceResponse.success<User>(updatedUser);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async remove(id: number, email: string): Promise<IServiceResponse<User>> {
    try {
      const user = await this.usersRepository.findOne(email);
      if (!user) return ServiceResponse.notFound('User not found');

      await this.usersRepository.remove(id);
      return ServiceResponse.success<User>(user);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async uploadAvatar(
    userId: number,
    file: Multer.File,
  ): Promise<IServiceResponse<string>> {
    try {
      const user = await this.usersRepository.findById(userId);
      const oldAvatar = user?.avatar?.split('/').pop();

      const bucketName = process.env.MINIO_BUCKET!;
      const objectName = `avatar-${userId}-${Date.now()}`;
      const uploadResult = await this.minioService.uploadFile(
        bucketName,
        objectName,
        file.buffer,
        file.mimetype,
      );

      if (uploadResult.error) {
        return { error: uploadResult.error, data: null };
      }

      const avatarUrl = `/${bucketName}/${objectName}`;

      await this.usersRepository.update(userId, {
        avatar: avatarUrl,
      });

      if (oldAvatar) {
        await this.minioService.deleteFile(bucketName, oldAvatar);
      }

      return ServiceResponse.success<string>('Avatar uploaded successfully');
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }

  async removeAvatar(userId: number): Promise<IServiceResponse<boolean>> {
    try {
      const user = await this.usersRepository.findById(userId);
      const oldAvatar = user?.avatar?.split('/').pop();
      const bucketName = process.env.MINIO_BUCKET!;

      if (oldAvatar) {
        await this.minioService.deleteFile(bucketName, oldAvatar);
      }

      await this.usersRepository.update(userId, { avatar: null });
      return ServiceResponse.success<boolean>(true);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: error.message }, data: null };
    }
  }
}
