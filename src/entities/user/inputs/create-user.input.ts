import { Field, InputType } from "@nestjs/graphql";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { UserModel } from "../user.model";

@InputType()
export class CreateUserInput implements Partial<UserModel> {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @Matches(/^[A-Za-z0-9]+$/)
  username: string;
  @Field()
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  email: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
