import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { Message, Session } from './chat.service.interface';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: RedisClientType;

  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL,
    });
  }

  async onModuleInit() {
    await this.redis.connect();
  }

  async onModuleDestroy() {
    await this.redis.disconnect();
  }

  async createSession(sessionId: string, session: Session): Promise<void> {
    await this.redis.hSet(`chat:sessions:${sessionId}`, {
      userId: session.userId,
      started: session.started,
      finished: session.finished,
    });

    await this.redis.set(`chat:activeUserSession:${session.userId}`, sessionId);
  }

  async restoreSession(userId: number): Promise<string | null> {
    const sessionId = await this.redis.get(`chat:activeUserSession:${userId}`);

    if (!sessionId) {
      return null;
    }

    return sessionId;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const session = await this.redis.hGetAll(`chat:sessions:${sessionId}`);

    if (!session) {
      return null;
    }

    return {
      userId: Number(session.userId),
      started: Number(session.started),
      finished: session.finished,
    };
  }

  async addMessage(sessionId: string, message: Message): Promise<void> {
    const session = await this.redis.hGet(
      `chat:sessions:${sessionId}`,
      'userId',
    );

    if (!session) {
      throw new Error('Session not found');
    }

    await this.redis.rPush(
      `chat:sessions:${sessionId}:messages`,
      JSON.stringify(message),
    );
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    const messages = await this.redis.lRange(
      `chat:sessions:${sessionId}:messages`,
      0,
      -1,
    );

    return messages.map((message) => JSON.parse(message));
  }

  async finishSession(sessionId: string) {
    const session = await this.redis.hGetAll(`chat:sessions:${sessionId}`);

    if (!session) {
      throw new Error('Session not found');
    }

    await this.redis.hSet(`chat:sessions:${sessionId}`, {
      finished: 'true',
    });

    await this.redis.del(`chat:activeUserSession:${session.userId}`);
  }

  async finishAllSessions() {
    const sessions = await this.redis.hGetAll('chat:sessions');

    for (const sessionId in sessions) {
      await this.redis.hSet(`chat:sessions:${sessionId}`, {
        finished: 'true',
      });
    }
  }
}
