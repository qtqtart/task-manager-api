import { PrismaService } from '@app/prisma/prisma.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

import { RefreshToken, Tokens } from './token.types';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(userId: string, userAgent: string) {
    return {
      accessToken: await this.createAccessToken(userId),
      refreshToken: await this.upsertRefreshToken(userId, userAgent),
    } as Tokens;
  }

  async upsertTokens(refreshToken: string) {
    const token = await this.prismaService.token.delete({
      where: {
        hash: refreshToken,
      },
    });

    const isExipred = new Date(token.expiresIn) < new Date();

    if (!token || isExipred) throw new UnauthorizedException();

    return {
      accessToken: await this.createAccessToken(token.userId),
      refreshToken: await this.upsertRefreshToken(
        token.userId,
        token.userAgent,
      ),
    } as Tokens;
  }

  async deleteRefreshToken(refreshToken: string) {
    return await this.prismaService.token.delete({
      where: {
        hash: refreshToken,
      },
    });
  }

  private async createAccessToken(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    const accessToken = `Bearer ${this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    })}`;

    return accessToken;
  }

  private async upsertRefreshToken(userId: string, userAgent: string) {
    const now = new Date();
    const expiresIn = new Date(new Date(now).setMonth(now.getMonth() + 1));

    // Поиск существующего токена
    const token = await this.prismaService.token.findFirst({
      where: {
        userId,
        userAgent,
      },
    });

    let refreshToken: RefreshToken;

    if (token) {
      refreshToken = await this.prismaService.token.update({
        where: {
          id: token.id,
        },
        data: {
          hash: uuid(),
          expiresIn,
        },
      });
    } else {
      refreshToken = await this.prismaService.token.create({
        data: {
          hash: uuid(),
          expiresIn,
          userId,
          userAgent,
        },
      });
    }

    return {
      hash: refreshToken.hash,
      expiresIn: refreshToken.expiresIn,
    } as RefreshToken;
  }
}
