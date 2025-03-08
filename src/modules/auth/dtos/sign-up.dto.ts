import { Confirm } from '@shared/decorators/confirm.decorator';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @Matches(/^[A-Za-z0-9]+$/)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  @Confirm(SignUpDto, (dto) => dto.password)
  passwordConfirm: string;

  image?: Express.Multer.File;
}
