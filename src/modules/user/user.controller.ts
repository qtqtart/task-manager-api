import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

import { Auth } from "~modules/auth/decorators/auth.decorator";

import { UserService } from "./user.service";

@Auth()
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAll(@Req() req: Request) {
    return await this.userService.getAll(req.user.id);
  }
}
