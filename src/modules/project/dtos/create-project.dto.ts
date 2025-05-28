import { Project } from "@prisma/client";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
} from "class-validator";

export class CreateProjectDto implements Partial<Project> {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @IsArray()
  @IsString({ each: true })
  memberIds: string[] = [];
}
