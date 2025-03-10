import { EnvironmentService } from '@app/environment/environment.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { S3Service } from '@app/s3/s3.service';
import { TokenService } from '@modules/token/token.service';
import { RefreshToken } from '@modules/token/token.types';
import { COOKIE_KEYS } from '@shared/consts/cookie-keys';

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { Response } from 'express';

import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(response: Response, dto: SignInDto, userAgent: string) {
    const isExistUser = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: dto.login }, { email: dto.login }],
      },
    });

    if (!isExistUser) throw new UnauthorizedException('Invalid credentials');
    const isVerifiedPassword = await verify(
      isExistUser.passwordHash,
      dto.password,
    );

    if (!isVerifiedPassword)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      isExistUser.id,
      userAgent,
    );
    this.setRefreshTokenToCookie(response, refreshToken);
    return { accessToken };
  }

  async signUp(
    response: Response,
    dto: SignUpDto,
    userAgent: string,
    file?: Express.Multer.File,
  ) {
    const users = await this.prismaService.user.findMany({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (users.some(({ username }) => username === dto.username))
      throw new ConflictException('user already exist with username');
    if (users.some(({ email }) => email === dto.email))
      throw new ConflictException('user already exist with email');

    const passwordHash = await hash(dto.password);
    const user = await this.prismaService.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash,
      },
    });

    if (file) {
      const key = `${user.id}/image/${file.originalname}`;
      await this.s3Service.upload(file.buffer, key, file.mimetype);
      const imageUrl = this.s3Service.keyToImageUrl(key);

      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          imageUrl,
        },
      });
    }

    const { accessToken, refreshToken } = await this.tokenService.getTokens(
      user.id,
      userAgent,
    );
    this.setRefreshTokenToCookie(response, refreshToken);
    return { accessToken };
  }

  async signOut(response: Response, refreshToken: string) {
    this.removeRefreshTokenFromCookie(response);
    await this.tokenService.deleteRefreshToken(refreshToken);
  }

  async refresh(response: Response, refreshTokenHash: string) {
    const tokens = await this.tokenService.upsertTokens(refreshTokenHash);
    this.setRefreshTokenToCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  private setRefreshTokenToCookie(
    response: Response,
    refreshToken: RefreshToken,
  ) {
    if (!refreshToken) throw new UnauthorizedException();

    response.cookie(COOKIE_KEYS.REFRESH_TOKEN, refreshToken.hash, {
      expires: new Date(refreshToken.expiresIn),
      httpOnly: this.environmentService.get('COOKIE_HTTP_ONLY'),
      secure: this.environmentService.get('COOKIE_SECURE'),
      sameSite: 'lax',
      path: '/',
    });
  }

  private removeRefreshTokenFromCookie(response: Response) {
    response.cookie(COOKIE_KEYS.REFRESH_TOKEN, undefined, {
      expires: new Date(),
      httpOnly: this.environmentService.get('COOKIE_HTTP_ONLY'),
      secure: this.environmentService.get('COOKIE_SECURE'),
      sameSite: 'lax',
      path: '/',
    });
  }
}
