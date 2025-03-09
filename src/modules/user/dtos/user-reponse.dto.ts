import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto implements User {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Exclude()
  passwordHash: string;

  @Expose()
  imageUrl: string;
}
