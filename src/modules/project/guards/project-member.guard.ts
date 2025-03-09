import { PrismaService } from '@app/prisma/prisma.service';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ProjectMemberGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const projectId = request.params.projectId;

    const isProjectMember = await this.prismaService.projectMember.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (!isProjectMember)
      throw new ForbiddenException('u dont have access to project');

    return true;
  }
}
