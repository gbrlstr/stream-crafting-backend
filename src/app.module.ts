import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { IsUniqueConstraint } from './utils/validators/validators';
import { PlayersModule } from './players/players.module';
import { GsiServerModule } from './gsi_server/gsi_server.module';
import { D2CastGatewayModule } from './d2cast-gateway/d2cast.module';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { HudsModule } from './huds/huds.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@d2cast.t9s3uvn.mongodb.net/${process.env.DB_DATABASE}?authSource=admin&retryWrites=true&w=majority&appName=${process.env.DB_DATABASE}`,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
      logging: true,
    }),
    TeamsModule,
    PlayersModule,
    GsiServerModule,
    D2CastGatewayModule,
    HudsModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, RedisIoAdapter],
})
export class AppModule {}
