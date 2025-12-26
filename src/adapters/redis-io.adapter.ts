import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  constructor(
    app: INestApplication,
    private readonly configService: ConfigService,
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisConfig = this.configService.get('redis');
    const publish = createClient({ url: redisConfig });
    const subscribe = publish.duplicate();
    publish.on('error', (error) => {
      console.log('redis connection failed: ', error);
    });
    subscribe.on('error', (error) => {
      console.log('redis connection failed: ', error);
    });
    this.adapterConstructor = createAdapter(publish, subscribe);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, options) as Server;
    server.adapter(this.adapterConstructor);
    const webSocketConfig = this.configService.get<any>('webSocket');
    const timeout: number =
      webSocketConfig?.websocketHearthbeatTimeout || 30000;
    setInterval(() => {
      const clients: Map<string, Socket> = server.sockets.sockets;
      Object.keys(clients).forEach((socketId) => {
        const socket: Socket = clients[socketId] as Socket;
        if (socket.connected) {
          socket.send('ping');
        }
      });
    }, timeout);

    server.on('connection', (socket) => {
      socket.on('message', (message: string) => {
        if (message === 'pong') {
          const pingTimeout = socket['pingTimeout'] as { refresh: () => void };
          pingTimeout.refresh();
        }
      });
    });
    return server;
  }
}
