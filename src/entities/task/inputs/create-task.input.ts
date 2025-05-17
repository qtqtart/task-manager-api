import { Field, InputType } from "@nestjs/graphql";
import { Task, TaskPriority, TaskState } from "@prisma/client";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

@InputType()
export class CreateTaskInput implements Partial<Task> {
  @Field(() => String)
  @IsString()
  @MaxLength(255)
  title: string;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
  @Field(() => TaskState)
  @IsEnum(TaskState)
  state: TaskState;
  @Field(() => TaskPriority)
  @IsEnum(TaskPriority)
  priority: TaskPriority;
  @Field(() => Date)
  @IsDate()
  startDate: Date;
  @Field(() => Date)
  @IsDate()
  endDate: Date;
  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  assigneeIds?: string[];
}
