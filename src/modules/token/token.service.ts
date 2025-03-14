import { PrismaService } from '@app/prisma/prisma.service';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async refresh(hash: string) {
    const token = await this.prismaService.token.findUnique({
      where: {
        hash,
      },
    });
    if (!token) throw new UnauthorizedException('Refresh token not found');

    const isExpired = new Date(token.expiresIn) < new Date();
    if (isExpired) {
      await this.prismaService.token.delete({
        where: {
          hash,
        },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.deleteRefreshToken(hash);
    const { accessToken } = await this.createAccessToken(token.userId);
    const { refreshToken } = await this.createRefreshToken(
      token.userId,
      token.userAgent,
    );
    return { accessToken, refreshToken };
  }

  async createAccessToken(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return { accessToken };
  }

  async createRefreshToken(userId: string, userAgent: string) {
    const { expiresIn } = this.getExpiresIn();
    const refreshToken = await this.prismaService.token.create({
      data: {
        hash: uuid(),
        expiresIn,
        userId,
        userAgent,
      },
    });
    return { refreshToken };
  }

  async deleteRefreshToken(hash: string) {
    await this.prismaService.token.delete({
      where: {
        hash,
      },
    });
  }

  private getExpiresIn() {
    const expiresIn = new Date();
    expiresIn.setMonth(expiresIn.getMonth() + 1);
    return { expiresIn };
  }
}
