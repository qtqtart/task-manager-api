import { Project } from '@prisma/client';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateProjectDto implements Partial<Project> {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @Matches(/^[A-Za-z0-9]+$/)
  description: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsUUID('all', { each: true })
  userIds: string[];
}
