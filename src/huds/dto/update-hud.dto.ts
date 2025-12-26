import { PartialType } from '@nestjs/swagger';
import { CreateHudDto } from './create-hud.dto';

export class UpdateHudDto extends PartialType(CreateHudDto) {}
