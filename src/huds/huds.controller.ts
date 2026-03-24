import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HudsService } from './huds.service';
import { CreateHudDto } from './dto/create-hud.dto';
import { UpdateHudDto } from './dto/update-hud.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('HUDs')
@Controller('huds')
export class HudsController {
  constructor(private readonly hudsService: HudsService) {}

  // Rota pública para buscar HUD por ID (usada no overlay do OBS)
  @Get('public/:id')
  @ApiResponse({
    status: 200,
    description: 'The record return a HUD (public access).',
  })
  @ApiResponse({ status: 404, description: 'HUD not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'HUD ID (secret key)',
    type: String,
  })
  async findOnePublic(@Param('id') id: string) {
    return await this.hudsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 201,
    description: 'The HUD has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateHudDto,
    description: 'Json structure for HUD object with elements',
  })
  async create(@Body() createHudDto: CreateHudDto, @Req() req) {
    createHudDto.userId = req.user.sub;
    return await this.hudsService.create(createHudDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 200,
    description: 'The record return all HUDs.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll() {
    return await this.hudsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 200,
    description: 'The record return a HUD.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid MongoDB ObjectId',
    type: String,
  })
  async findOne(@Param('id') id: string) {
    return await this.hudsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid MongoDB ObjectId',
    type: String,
  })
  @ApiBody({
    type: UpdateHudDto,
    description: 'Json structure for HUD object',
  })
  async update(@Param('id') id: string, @Body() updateHudDto: UpdateHudDto) {
    return await this.hudsService.update(id, updateHudDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be a valid MongoDB ObjectId',
    type: String,
  })
  async remove(@Param('id') id: string) {
    return await this.hudsService.remove(id);
  }
}
