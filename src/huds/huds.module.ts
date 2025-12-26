import { Module } from '@nestjs/common';
import { HudsService } from './huds.service';
import { HudsController } from './huds.controller';
import { HudEntity } from './entities/hud.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HudEntity])],
  controllers: [HudsController],
  providers: [HudsService],
})
export class HudsModule {}
