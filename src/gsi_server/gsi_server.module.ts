import { Module } from '@nestjs/common';
import { GsiServerController } from './gsi_server.controller';
import { GsiServerService } from './gsi_server.service';

@Module({
  controllers: [GsiServerController],
  providers: [GsiServerService],
})
export class GsiServerModule {}
