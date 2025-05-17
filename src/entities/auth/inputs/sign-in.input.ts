import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@InputType()
export class SignInInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  login: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
