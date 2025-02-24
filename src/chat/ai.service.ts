export class AIService {
  constructor() {
    // connection to Google AI API
  }

  async generateResponse(message: string): Promise<string> {
    // call AI API to generate response
    return 'Response from AI on message: ' + message;
  }
}
