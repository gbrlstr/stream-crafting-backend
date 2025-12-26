import { IsArray, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface HudElement {
  id: string;
  component: string;
  backgroundColor?: string;
  color: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  isShowed: boolean;
  maintainAspectRatio: boolean;
  layer: number;
  data: Record<string, any>;
  active: boolean;
  isInsideBoundingBox: boolean;
}

@Entity('huds')
export class HudEntity {
  @PrimaryColumn()
  @ObjectIdColumn()
  _id?: ObjectId;

  @IsString()
  @Column()
  name: string;

  @IsOptional()
  @IsString()
  @Column()
  userId?: string;

  @IsArray()
  @Column()
  elements: HudElement[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
