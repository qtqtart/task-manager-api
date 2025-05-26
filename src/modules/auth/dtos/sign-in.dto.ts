import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  login: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;
}
