/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { Logger } from '@nestjs/common';
import { D2CastService } from './d2cast.service';

@WebSocketGateway(5120, {
  cors: {
    // origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    //   'http://localhost:3000',
    // ],
    origin: '*',
    // credentials: true,
  },
})
export class D2CastGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(D2CastGateway.name);
  private hudSockets: Map<string, string> = new Map(); // hudId -> socketId

  @WebSocketServer() wss: Namespace;

  constructor(private readonly d2castService: D2CastService) {}

  afterInit() {
    this.logger.log('Dota2 Data Gateway initialized');
  }

  handleConnection(client: Socket, ..._args: any[]) {
    this.logger.log(`Client id: ${client.id} connected`);

    if (this.wss) {
      this.logger.debug(
        `Number of connected clients: ${this.wss.sockets.size}`,
      );
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('join-hud')
  handleJoinRoom(client: Socket, payload: { hudId: string }) {
    const hudId = payload.hudId;
    client.join(hudId);
    this.hudSockets.set(hudId, client.id);
    this.logger.log(`Client id: ${client.id} joined room: ${hudId}`);
  }

  @SubscribeMessage('dota:draft')
  handleGameDraft(client: Socket, payload: any) {
    const hudId = payload.hudId;
    this.logger.log(`Received draft data for HUD: ${hudId}`);
    this.wss.to(hudId).emit('dota:draft', payload);
  }
}
