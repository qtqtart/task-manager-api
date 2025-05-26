import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

import { CreateUserDto } from "~modules/user/dtos/create-user.dto";
import { Confirm } from "~shared/decorators/confirm.decorator";

export class SignUpDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @Confirm(SignUpDto, (i) => i.password)
  passwordConfirm: string;
}
