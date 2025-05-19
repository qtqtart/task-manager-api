import { EnvironmentService } from "@app/environment/environment.service";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User } from "@prisma/client";
import { Request } from "express";

@Injectable()
export class SessionService {
  constructor(private readonly environmentService: EnvironmentService) {}

  public createSession(req: Request, user: Omit<User, "password">) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.createdAt = new Date();
      req.session.save((error) => {
        if (error) {
          return reject(
            new InternalServerErrorException("session was not created"),
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
            new InternalServerErrorException("session was not removed"),
          );
        }
        req.res.clearCookie(this.environmentService.get("SESSION_NAME"));
        resolve(true);
      });
    });
  }
}
