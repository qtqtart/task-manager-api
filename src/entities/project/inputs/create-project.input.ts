import { Field, InputType } from "@nestjs/graphql";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from "class-validator";

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
  @Field(() => [String])
  @IsArray()
  @IsOptional()
  memberIds?: string[];
}
