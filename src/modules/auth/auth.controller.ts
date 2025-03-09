import { COOKIE_KEYS } from '@shared/consts/cookie-keys';
import { Cookie } from '@shared/decorators/cookie.decorator';
import { UserAgent } from '@shared/decorators/user-agent.decorator';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { Public } from './guards/public.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async singIn(
    @Res() response: Response,
    @Body() dto: SignInDto,
    @UserAgent() userAgent: string,
  ) {
    const accessToken = await this.authService.signIn(response, dto, userAgent);
    return response.json({ accessToken });
  }

  @Public()
  @Post('sign-up')
  @UseInterceptors(FileInterceptor('file'))
  async signUp(
    @Res() response: Response,
    @Body() dto: SignUpDto,
    @UserAgent() userAgent: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const accessToken = await this.authService.signUp(
      response,
      dto,
      userAgent,
      file,
    );
    return response.json({ accessToken });
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @Res() response: Response,
    @Cookie(COOKIE_KEYS.REFRESH_TOKEN) refreshToken: string,
  ) {
    if (!refreshToken) {
      response.sendStatus(HttpStatus.OK);
      return;
    }

    await this.authService.signOut(response, refreshToken);
  }

  @Post('refresh')
  async refresh(
    @Res() response: Response,
    @Cookie(COOKIE_KEYS.REFRESH_TOKEN) refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const accessToken = await this.authService.refresh(response, refreshToken);
    return response.json({ accessToken });
  }
}
