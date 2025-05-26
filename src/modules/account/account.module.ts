import { Module } from "@nestjs/common";

import { UserService } from "~modules/user/user.service";

import { AccountController } from "./account.controller";

@Module({
  controllers: [AccountController],
  providers: [UserService],
})
export class AccountModule {}
