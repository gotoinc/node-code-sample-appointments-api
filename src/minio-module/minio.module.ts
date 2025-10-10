import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { MinioServiceSymbol } from './minio.service.interface';
import { Logger } from 'nestjs-pino';

@Module({})
export class MinioModule {
  static register(bucketName: string) {
    return {
      module: MinioModule,
      providers: [
        {
          provide: MinioServiceSymbol,
          useFactory: (logger: ILogger) => {
            return new MinioService(logger, bucketName);
          },
          inject: [Logger],
        },
      ],
      exports: [MinioServiceSymbol],
    };
  }
}
