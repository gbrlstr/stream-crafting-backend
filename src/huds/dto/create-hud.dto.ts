import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PositionDto {
  @ApiProperty({
    example: 754.114501953125,
    description: 'X coordinate position',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  x: number;

  @ApiProperty({
    example: 447.5867919921875,
    description: 'Y coordinate position',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  y: number;
}

class SizeDto {
  @ApiProperty({
    example: 120,
    description: 'Width in pixels',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty({
    example: 120,
    description: 'Height in pixels',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  height: number;
}

export class HudElementDto {
  @ApiProperty({
    example: 'cec40e0ca3068b51fc69c4a1ca51ee81ea7c7f8d',
    description: 'Unique identifier for the element',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'text',
    description: 'Component type (text, image, etc)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  component: string;

  @ApiProperty({
    example: '#4a765b',
    description: 'Background color of the element',
    required: false,
  })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiProperty({
    example: '#ffffff',
    description: 'Text/foreground color of the element',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: { x: 754.114501953125, y: 447.5867919921875 },
    description: 'Position coordinates',
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  @IsNotEmpty()
  position: PositionDto;

  @ApiProperty({
    example: { width: 120, height: 120 },
    description: 'Size dimensions',
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => SizeDto)
  @IsNotEmpty()
  size: SizeDto;

  @ApiProperty({
    example: true,
    description: 'Whether the element is currently shown',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isShowed: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether to maintain aspect ratio',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  maintainAspectRatio: boolean;

  @ApiProperty({
    example: 0,
    description: 'Layer order (z-index)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  layer: number;

  @ApiProperty({
    example: { text: 'Elemento de texto' },
    description: 'Component-specific data',
    required: true,
  })
  @IsObject()
  @IsNotEmpty()
  data: Record<string, any>;

  @ApiProperty({
    example: true,
    description: 'Whether the element is active',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the element is inside bounding box',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isInsideBoundingBox: boolean;
}

export class CreateHudDto {
  @ApiProperty({
    example: 'Main HUD Layout',
    description: 'Name of the HUD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User ID who created the HUD',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    type: [HudElementDto],
    description: 'Array of HUD elements',
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HudElementDto)
  @IsNotEmpty()
  elements: HudElementDto[];
}
