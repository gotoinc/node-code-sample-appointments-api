import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ILogger } from 'src/common/interfaces/logger.interface';
import { MinioServiceSymbol } from './minio.service.interface';
import { Logger } from 'nestjs-pino';

@Module({
  providers: [
    {
      provide: MinioServiceSymbol,
      useFactory: (logger: ILogger) => {
        return new MinioService(logger);
      },
      inject: [Logger],
    },
  ],
  exports: [MinioServiceSymbol],
})
export class MinioModule {}
