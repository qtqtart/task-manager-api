import { Token } from '@prisma/client';

export type RefreshToken = Pick<Token, 'hash' | 'expiresIn'>;

export type Tokens = {
  accessToken: string;
  refreshToken: RefreshToken;
};
