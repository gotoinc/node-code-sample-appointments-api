import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { MinioServiceSymbol } from './minio.service.interface';

@Module({
  providers: [
    {
      provide: MinioServiceSymbol,
      useFactory: (logger: ILogger) => {
        return new MinioService(logger);
      },
    },
  ],
  exports: [MinioServiceSymbol],
})
export class MinioModule {}
