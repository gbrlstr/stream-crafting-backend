import { Module } from '@nestjs/common';
import { D2CastGateway } from './d2cast.gateway';
import { D2CastService } from './d2cast.service';
@Module({
  providers: [D2CastGateway, D2CastService],
  exports: [D2CastGateway],
})
export class D2CastGatewayModule {}
