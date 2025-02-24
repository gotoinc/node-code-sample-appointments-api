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

@WebSocketGateway({
  path: '/ws',
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
    const response = await this.chatService.handleMessage(payload);
    client.send(JSON.stringify({ event: 'chat-response', data: response }));
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const headers = request.headers;
    const decoded = await this.authenticate(headers).catch((err) => {
      this.logger.error(err);
      return client.close();
    });
    console.log({ decoded });
    client.send(
      JSON.stringify({
        event: 'welcome',
        data: 'Connected to WebSocket server',
      }),
    );
  }

  handleDisconnect(/* client: WebSocket */) {
    console.log('Client disconnected');
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
