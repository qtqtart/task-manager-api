import { Field, InputType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString } from "class-validator";

@InputType()
export class ProjectFiltersInput {
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  searchTerms?: string;
}
