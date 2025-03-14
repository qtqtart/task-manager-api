import { EnvironmentService } from '@app/environment/environment.service';
import { PrismaService } from '@app/prisma/prisma.service';
import { S3Service } from '@app/s3/s3.service';
import { TokenService } from '@modules/token/token.service';
import { RefreshToken } from '@modules/token/token.types';
import { COOKIE_KEYS } from '@shared/consts/cookie-keys';

import { ConflictException, Injectable } from '@nestjs/common';
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
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: dto.login }, { email: dto.login }],
      },
    });

    if (!user) throw new ConflictException('Invalid credentials');
    const isVerifiedPassword = await verify(user.passwordHash, dto.password);
    if (!isVerifiedPassword) throw new ConflictException('Invalid credentials');

    const { accessToken } = await this.tokenService.createAccessToken(user.id);
    const { refreshToken } = await this.tokenService.createRefreshToken(
      user.id,
      userAgent,
    );
    this.setCookie(response, refreshToken);
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

    const { accessToken } = await this.tokenService.createAccessToken(user.id);
    const { refreshToken } = await this.tokenService.createRefreshToken(
      user.id,
      userAgent,
    );
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  async signOut(response: Response, hash: string) {
    response.clearCookie(COOKIE_KEYS.REFRESH_TOKEN);
    await this.tokenService.deleteRefreshToken(hash);
  }

  async refresh(response: Response, hash: string) {
    const { accessToken, refreshToken } = await this.tokenService.refresh(hash);
    this.setCookie(response, refreshToken);
    return { accessToken };
  }

  private setCookie(response: Response, { hash, expiresIn }: RefreshToken) {
    response.cookie(COOKIE_KEYS.REFRESH_TOKEN, hash, {
      expires: new Date(expiresIn),
      httpOnly: this.environmentService.get('COOKIE_HTTP_ONLY'),
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
  }
}
