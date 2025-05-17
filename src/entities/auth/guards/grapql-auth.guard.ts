import { PrismaService } from "@app/prisma/prisma.service";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

@Injectable()
export class GraphQLAuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  public async canActivate(
    executionContext: ExecutionContext,
  ): Promise<boolean> {
    const context = GqlExecutionContext.create(executionContext);
    const req: Request = context.getContext();

    if (typeof req.session.userId === "undefined") {
      throw new UnauthorizedException("user not found");
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: req.session.userId,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException("user not found");
    }

    req.user = user;
    return true;
  }
}
