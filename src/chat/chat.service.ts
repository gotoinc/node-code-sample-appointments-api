import { AIService } from './ai.service';
import { IChatService } from './chat.service.interface';

class ChatService implements IChatService {
  constructor(private readonly aiService: AIService) {}

  async handleMessage(message: string): Promise<string> {
    const response = await this.aiService.generateResponse(
      message /** tuning params */,
    );

    return response;
  }
}

export default ChatService;
