import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { Logger } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';
import { AIServiceSymbol, IAIService } from './ai.service.interface';
import { AIService } from './ai.service';
import { ChatServiceSymbol } from './chat.service.interface';
import ChatService from './chat.service';

@Module({
  imports: [ConfigModule],
  providers: [
    Logger,
    ChatGateway,
    {
      provide: ChatServiceSymbol,
      useFactory: (aiService: IAIService) => {
        return new ChatService(aiService);
      },
      inject: [AIServiceSymbol],
    },
    {
      provide: AIServiceSymbol,
      useFactory: () => {
        return new AIService();
      },
    },
  ],
})
export class ChatModule {}
