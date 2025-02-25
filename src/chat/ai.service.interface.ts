export const AIServiceSymbol = Symbol('AIService');

export interface IAIService {
  generateResponse(message: string, tuningPrompt?: string): Promise<string>;
}
