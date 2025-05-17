import { CreateUserInput } from "@entities/user/inputs/create-user.input";
import { Field, InputType } from "@nestjs/graphql";
import { Confirm } from "@shared/decorators/confirm.decorator";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@InputType()
export class SignUpInput extends CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Confirm(SignUpInput, (i) => i.password)
  passwordConfirm: string;
}
