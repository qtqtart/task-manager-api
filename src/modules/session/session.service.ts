import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";
import { I18nService } from "nestjs-i18n";

import { I18nTranslations } from "~_i18n";
import { EnvironmentService } from "~app/environment/environment.service";

@Injectable()
export class SessionService {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public createSession(req: Request, user: Omit<User, "password">) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.createdAt = new Date();
      req.session.save((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              this.i18n.t("error.create_session"),
            ),
          );
        }
        resolve(true);
      });
    });
  }

  public removeSession(req: Request) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              this.i18n.t("error.delete_session"),
            ),
          );
        }
        req.res.clearCookie(this.environmentService.get("SESSION_NAME"));
        resolve(true);
      });
    });
  }
}
