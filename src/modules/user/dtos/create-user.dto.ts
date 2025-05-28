import { User } from "@prisma/client";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto implements Partial<User> {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @Matches(/^[A-Za-z0-9]+$/)
  username: string;
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  email: string;
  @IsString()
  @IsOptional()
  @MaxLength(255)
  firstName?: string;
  @IsString()
  @IsOptional()
  @MaxLength(255)
  lastName?: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
