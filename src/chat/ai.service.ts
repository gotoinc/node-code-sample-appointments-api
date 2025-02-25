import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { IAIService } from './ai.service.interface';

export class AIService implements IAIService {
  private model: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (!apiKey) throw new Error('No API key found');
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateResponse(message: string, tuningPrompt = ''): Promise<string> {
    const { response } = await this.model.generateContent(
      tuningPrompt + message,
    );
    const text = response.text();

    return text.replace(/\n/g, '');
  }
}
