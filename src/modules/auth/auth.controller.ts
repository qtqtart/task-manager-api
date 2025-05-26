import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { SignInDto } from "./dtos/sign-in.dto";
import { SignUpDto } from "./dtos/sign-up.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-in")
  async signIn(
    @Body() dto: SignInDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.authService.signIn(req, dto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post("sign-up")
  async signUp(
    @Body() dto: SignUpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const result = await this.authService.singUp(req, dto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Post("sign-out")
  async signOut(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.singOut(req);
    return res.status(HttpStatus.OK).json(result);
  }
}
