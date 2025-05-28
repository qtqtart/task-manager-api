import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { verify } from "argon2";
import { Request } from "express";
import { I18nService } from "nestjs-i18n";

import { I18nTranslations } from "~_i18n";
import { PrismaService } from "~app/prisma/prisma.service";
import { SessionService } from "~modules/session/session.service";
import { UserService } from "~modules/user/user.service";

import { SignInDto } from "./dtos/sign-in.dto";
import { SignUpDto } from "./dtos/sign-up.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async signIn(req: Request, dto: SignInDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: dto.login }, { email: dto.login }],
      },
    });
    if (!user) {
      throw new NotFoundException(this.i18n.t("error.user_not_found"));
    }

    const isValidPassword = await verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException(this.i18n.t("error.invalid_password"));
    }
    return this.sessionService.createSession(req, user.id);
  }

  public async singUp(req: Request, dto: SignUpDto) {
    const user = await this.userService.create(dto);
    return this.sessionService.createSession(req, user.id);
  }

  public async singOut(req: Request) {
    return this.sessionService.removeSession(req);
  }
}
