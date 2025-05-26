import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { I18nService } from "nestjs-i18n";

import { I18nTranslations } from "~_i18n";
import { PrismaService } from "~app/prisma/prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async canActivate(
    executionContext: ExecutionContext,
  ): Promise<boolean> {
    const req = executionContext.switchToHttp().getRequest<Request>();

    if (typeof req.session?.userId === "undefined") {
      throw new UnauthorizedException(this.i18n.t("error.user_not_found"));
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: req.session.userId,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException(this.i18n.t("error.user_not_found"));
    }

    req.user = user;
    return true;
  }
}
