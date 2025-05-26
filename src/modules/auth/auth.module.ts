import { Module } from "@nestjs/common";

import { SessionService } from "~modules/session/session.service";
import { UserService } from "~modules/user/user.service";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, SessionService, UserService],
})
export class AuthModule {}
