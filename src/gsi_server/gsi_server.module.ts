import { Module } from '@nestjs/common';
import { GsiServerController } from './gsi_server.controller';
import { GsiServerService } from './gsi_server.service';
import { D2CastGatewayModule } from 'src/d2cast-gateway/d2cast.module';

@Module({
  imports: [D2CastGatewayModule],
  controllers: [GsiServerController],
  providers: [GsiServerService],
})
export class GsiServerModule {}
