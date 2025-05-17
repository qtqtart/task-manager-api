import { Field, InputType } from "@nestjs/graphql";
import { Project } from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

@InputType()
export class UpdateProjectInput implements Partial<Project> {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
  @Field(() => [Boolean], { nullable: true })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  memberIds?: string[];
}
