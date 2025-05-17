import { Field, ID, InputType } from "@nestjs/graphql";
import { Task, TaskPriority, TaskState } from "@prisma/client";
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

@InputType()
export class TaskFiltersInput implements Partial<Task> {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  userId?: string;
  @Field(() => TaskState, { nullable: true })
  @IsEnum(TaskState)
  @IsOptional()
  state?: TaskState;
  @Field(() => TaskPriority, { nullable: true })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerms?: string;
}
