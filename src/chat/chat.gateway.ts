import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { IncomingMessage } from 'http';
import { Server, WebSocket } from 'ws';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { IncomingHttpHeaders } from 'http';
import { ChatServiceSymbol, IChatService } from './chat.service.interface';
import { Inject } from '@nestjs/common';
import { AccessTokenPayload } from 'src/iam/authentication/interfaces/access-token-payload.interface';

@WebSocketGateway({
  path: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    @Inject(ChatServiceSymbol) private readonly chatService: IChatService,
  ) {}

  @SubscribeMessage('chat-message')
  async handleMessage(client: WebSocket, payload: any): Promise<void> {
    console.log('Received:', payload);
    console.log('Session ID:', client.sessionId);
    const response = await this.chatService.handleMessage(
      client.sessionId,
      payload,
    );
    client.send(JSON.stringify({ event: 'chat-response', data: response }));
  }

  @SubscribeMessage('chat-finish')
  async handleFinish(client: WebSocket, payload: any): Promise<void> {
    console.log('Received:', payload);
    console.log('Session ID:', client.sessionId);
    const response = await this.chatService.finish(client.sessionId);
    client.send(JSON.stringify({ event: 'chat-finished', data: response }));
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const headers = request.headers;

    try {
      const decoded = await this.authenticate(headers);
      if ((decoded as AccessTokenPayload).role !== 'patient')
        return client.close();

      const userId = (decoded as AccessTokenPayload).sub;

      const sessionId = await this.chatService.start(userId);
      client.sessionId = sessionId;

      client.send(
        JSON.stringify({
          event: 'chat-started',
          data: 'Chat started',
        }),
      );
    } catch (err) {
      this.logger.error(err);
      return client.close();
    }
  }

  async handleDisconnect(/* client: WebSocket */) {
    this.logger.log(`Client disconnected`);
  }

  private authenticate(headers: IncomingHttpHeaders) {
    return new Promise((resolve, reject) => {
      const authorizationHeader = headers['authorization'];
      if (!authorizationHeader)
        return reject(new Error('No authorization header'));
      const authToken = authorizationHeader.split(' ')[1];
      if (!authToken) reject(new Error('No authorization token'));
      jwt.verify(
        authToken,
        this.configService.get<string>('JWT_SECRET') || '',
        { ignoreExpiration: false },
        (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        },
      );
    });
  }
}
