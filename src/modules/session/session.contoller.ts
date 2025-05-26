import { Controller, Delete, HttpStatus, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { EnvironmentService } from "~app/environment/environment.service";

@Controller("session")
export class SessionController {
  constructor(private readonly environmentService: EnvironmentService) {}

  @Delete()
  public async clear(@Req() req: Request, @Res() res: Response) {
    req.res.clearCookie(this.environmentService.get("SESSION_NAME"));
    return res.send(HttpStatus.OK);
  }
}
