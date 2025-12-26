import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: MongoRepository<TeamEntity>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    return await this.teamRepository.save(createTeamDto);
  }

  async findAll(): Promise<TeamEntity[]> {
    return await this.teamRepository.find();
  }

  async findOne(name: string): Promise<TeamEntity> {
    return await this.teamRepository.findOne({ where: { name } });
  }

  async update(
    id: string | ObjectId,
    updateTeamDto: UpdateTeamDto,
  ): Promise<TeamEntity> {
    try {
      const team = await this.teamRepository.findOne({
        where: { _id: new ObjectId(id) },
      });
      if (!team) {
        throw new BadRequestException({
          success: false,
          message: 'Team not found',
        });
      }
      const teamUpdate = this.teamRepository.merge(team, updateTeamDto);
      return await this.teamRepository.save(teamUpdate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string | ObjectId): Promise<TeamEntity> {
    const team = await this.teamRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!team) {
      throw new BadRequestException({
        success: false,
        message: 'Team not found',
      });
    }
    return await this.teamRepository.remove(team);
  }
}
