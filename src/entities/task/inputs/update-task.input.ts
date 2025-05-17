import { Field, InputType } from "@nestjs/graphql";
import { $Enums, Task, TaskPriority, TaskState } from "@prisma/client";
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

@InputType()
export class UpdateTaskInput implements Partial<Task> {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
  @Field(() => TaskState, { nullable: true })
  @IsOptional()
  @IsEnum(TaskState)
  state?: TaskState;
  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;
  @Field(() => [Boolean], { nullable: true })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  assigneeIds?: string[];
}
