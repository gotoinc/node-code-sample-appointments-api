export const ChatServiceSymbol = Symbol('ChatService');

export interface IChatService {
  handleMessage(message: string): Promise<string>;
}
