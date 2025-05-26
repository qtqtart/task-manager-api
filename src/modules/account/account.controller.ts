import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

import { Auth } from "~modules/auth/decorators/auth.decorator";
import { UserService } from "~modules/user/user.service";

@Auth()
@Controller("account")
export class AccountController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async currentUser(@Req() req: Request) {
    return await this.userService.getById(req.user.id);
  }
}
