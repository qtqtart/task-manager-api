import { Project } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

export class UpdateProjectDto implements Partial<Project> {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
  @IsArray()
  @IsOptional()
  memberIds?: string[];
}
