import { IAIService } from './ai.service.interface';
import { IChatService, Session } from './chat.service.interface';
import { randomUUID } from 'crypto';
import { RedisService } from './redis.service';
import { ILogger } from 'src/common/interfaces/logger.interface';

class ChatService implements IChatService {
  constructor(
    private readonly logger: ILogger,
    private readonly aiService: IAIService,
    private readonly redisService: RedisService,
  ) {}

  async start(userId: number): Promise<string> {
    const restoredSessionId = await this.redisService.restoreSession(userId);

    if (restoredSessionId) {
      this.logger.log(`Chat session restored for user ${userId}`);
      return restoredSessionId;
    }

    const sessionId = randomUUID();

    const session: Session = {
      userId: userId,
      started: Date.now(),
      finished: 'false',
    };

    await this.redisService.createSession(sessionId, session);

    return sessionId;
  }

  async finish(sessionId: string) {
    await this.redisService.finishSession(sessionId);
    this.logger.log(`Chat session finished for session ${sessionId}`);
  }

  async handleMessage(sessionId: string, message: string): Promise<string> {
    const session = await this.redisService.getSession(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    await this.redisService.addMessage(sessionId, {
      role: 'user',
      content: message,
      timestamp: Date.now(),
    });

    const response = await this.aiService.generateResponse(
      message /** tuning params */,
    );

    await this.redisService.addMessage(sessionId, {
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    });

    return response;
  }

  async finishAllSessions() {
    await this.redisService.finishAllSessions();
  }
}

export default ChatService;
