import { Confirm } from '@shared/decorators/confirm.decorator';

import { User } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto implements Partial<User> {
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
  @IsNotEmpty()
  @MaxLength(255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Confirm(SignUpDto, (dto) => dto.password)
  passwordConfirm: string;
}
