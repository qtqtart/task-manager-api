import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto implements User {
  @Expose()
  id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  passwordHash: string;

  @Expose()
  imageUrl: string;
}
