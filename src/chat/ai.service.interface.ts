export const AIServiceSymbol = Symbol('AIService');

export interface IAIService {
  generateResponse(message: string): Promise<string>;
}
