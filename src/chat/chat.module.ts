import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Logger } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AIServiceSymbol, IAIService } from './ai.service.interface';
import { AIService } from './ai.service';
import { ChatServiceSymbol } from './chat.service.interface';
import ChatService from './chat.service';
import { RedisService } from './redis.service';
import { ILogger } from 'src/common/interfaces/logger.interface';

@Module({
  imports: [ConfigModule],
  providers: [
    Logger,
    ChatGateway,
    RedisService,
    {
      provide: AIServiceSymbol,
      useFactory: (configService: ConfigService) => {
        return new AIService(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: ChatServiceSymbol,
      useFactory: (
        logger: ILogger,
        aiService: IAIService,
        redisService: RedisService,
      ) => {
        return new ChatService(logger, aiService, redisService);
      },
      inject: [Logger, AIServiceSymbol, RedisService],
    },
  ],
})
export class ChatModule {}
