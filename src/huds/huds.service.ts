import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHudDto } from './dto/create-hud.dto';
import { UpdateHudDto } from './dto/update-hud.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HudEntity } from './entities/hud.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class HudsService {
  constructor(
    @InjectRepository(HudEntity)
    private readonly hudRepository: MongoRepository<HudEntity>,
  ) {}

  async create(createHudDto: CreateHudDto): Promise<HudEntity> {
    return await this.hudRepository.save(createHudDto);
  }

  async findAll(): Promise<{ items: HudEntity[]; total: number }> {
    const huds = await this.hudRepository.find();
    return {
      items: huds,
      total: huds.length,
    };
  }

  async findOne(id: string): Promise<HudEntity> {
    const hud = await this.hudRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!hud) {
      throw new BadRequestException({
        success: false,
        message: 'HUD not found',
      });
    }
    return hud;
  }

  async update(id: string, updateHudDto: UpdateHudDto) {
    try {
      const hud = await this.findOne(id);
      Object.assign(hud, updateHudDto);
      return await this.hudRepository.save({
        ...hud,
        _id: new ObjectId(id),
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const hud = await this.findOne(id);
      return await this.hudRepository.remove(hud);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
