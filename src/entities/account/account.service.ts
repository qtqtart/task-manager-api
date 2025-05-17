import { PrismaService } from "@app/prisma/prisma.service";
import { UserService } from "@entities/user/user.service";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class AccountService {
  constructor(private readonly userService: UserService) {}

  public async getCurrent(req: Request) {
    return await this.userService.getById(req.user.id);
  }
}
