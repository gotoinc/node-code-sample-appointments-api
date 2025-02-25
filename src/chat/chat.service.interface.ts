export const ChatServiceSymbol = Symbol('ChatService');

export interface IChatService {
  start(userId: number): Promise<string>;
  finish(sessionId: string): Promise<void>;
  finishAllSessions(): Promise<void>;
  handleMessage(sessionId: string, message: string): Promise<string>;
}

export interface Session {
  userId: number;
  started: number;
  finished: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
