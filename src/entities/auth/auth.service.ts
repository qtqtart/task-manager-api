import { PrismaService } from "@app/prisma/prisma.service";
import { SessionService } from "@entities/session/session.service";
import { UserService } from "@entities/user/user.service";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { verify } from "argon2";
import { Request } from "express";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";
import Upload from "graphql-upload/Upload.mjs";

import { SignInInput } from "./inputs/sign-in.input";
import { SignUpInput } from "./inputs/sign-up.input";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  public async singIn(req: Request, input: SignInInput) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: input.login }, { email: input.login }],
      },
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }

    const isValidPassword = verify(user.password, input.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("password is invalid");
    }

    return this.sessionService.createSession(req, user);
  }
  public async singUp(req: Request, input: SignUpInput, upload: Upload) {
    const user = await this.userService.create(input, upload.file);
    console.log(upload);
    return this.sessionService.createSession(req, user);
  }
  public singOut(req: Request) {
    return this.sessionService.removeSession(req);
  }
}
