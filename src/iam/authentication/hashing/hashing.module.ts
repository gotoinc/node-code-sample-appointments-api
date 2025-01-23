import { Module } from '@nestjs/common';
import { HashingServiceSymbol } from './hashing.service.interface';
import { HashingService } from './hashing.service';

@Module({
  imports: [],
  providers: [
    {
      provide: HashingServiceSymbol,
      useFactory: () => {
        return new HashingService();
      },
    },
  ],
  exports: [HashingServiceSymbol],
})
export class HashingModule {}
