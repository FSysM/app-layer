import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

export type NotificationEmitPayload = {
  type: string;
  message: string;
  entityType?: string;
  entityId?: string;
  createdAt: Date;
};

@WebSocketGateway({
  namespace: '/notifications',
  cors: { origin: '*', credentials: true },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string;
      if (!token) throw new Error('No token');
      const payload = this.jwtService.verify(token);
      const userId: string = payload.sub;
      client.data.userId = userId;
      await client.join(`user:${userId}`);
      this.logger.log(`Client connected: ${userId}`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(
      `Client disconnected: ${client.data.userId ?? 'unknown'}`,
    );
  }

  emitToUser(userId: string, data: NotificationEmitPayload) {
    this.server.to(`user:${userId}`).emit('notification', data);
  }
}
