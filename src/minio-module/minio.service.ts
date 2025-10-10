import { OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandOutput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { IServiceResponse, ServiceResponse } from 'src/common/service-response';
import { IMinioService } from './minio.service.interface';

export class MinioService implements OnModuleInit, IMinioService {
  private s3: S3Client;

  constructor(
    private readonly logger: ILogger,
    private readonly bucketName: string,
  ) {}

  onModuleInit() {
    const accessKeyId = process.env.MINIO_ACCESS_KEY ?? '';
    const secretAccessKey = process.env.MINIO_SECRET_KEY ?? '';

    this.s3 = new S3Client({
      endpoint: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
      region: 'us-east-1',
    });
  }

  async uploadFile(
    key: string,
    body: Buffer,
    mimetype: string,
  ): Promise<IServiceResponse<PutObjectCommandOutput>> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: mimetype,
    });

    try {
      const result = await this.s3.send(command);
      return ServiceResponse.success(result);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error uploading file' }, data: null };
    }
  }

  async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    try {
      const result = await this.s3.send(command);
      return ServiceResponse.success(result.Body);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error getting file' }, data: null };
    }
  }

  async deleteFile(key: string): Promise<IServiceResponse<string>> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    try {
      await this.s3.send(command);
    } catch (error) {
      this.logger.error(error);
      return { error: { message: 'Error deleting file' }, data: null };
    }

    return ServiceResponse.success('File deleted successfully');
  }
}
