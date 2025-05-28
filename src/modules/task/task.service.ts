import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TaskPriority, TaskState } from "@prisma/client";
import { I18nService } from "nestjs-i18n";

import { I18nTranslations } from "~_i18n";
import { PrismaService } from "~app/prisma/prisma.service";

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async getById(taskId: string, userId: string) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw new NotFoundException(this.i18n.t("error.task_not_found"));
    }
    await this.checkOwnership(task.projectId, userId);
    return task;
  }

  public async getAll(
    projectId: string,
    filters: {
      searchTerms?: string;
      isArchived?: boolean;
      startDate?: string;
      endDate?: string;
      state?: TaskState;
      priority?: TaskPriority;
      assigneeId?: string;
    },
    userId: string,
  ) {
    await this.checkOwnership(projectId, userId);
    return await this.prismaService.task.findMany({
      where: {
        projectId,
        ...(filters.searchTerms && {
          title: { contains: filters.searchTerms, mode: "insensitive" },
        }),
        ...(filters.isArchived && {
          isArchived: filters.isArchived,
        }),
        ...(filters.startDate && {
          startDate: filters.startDate,
        }),
        ...(filters.priority && {
          priority: filters.priority,
        }),
        ...(filters.startDate &&
          filters.endDate && {
            startDate: { gte: new Date(filters.startDate) },
            endDate: { lte: new Date(filters.endDate) },
          }),
        ...(filters.assigneeId && {
          assignees: {
            some: { id: filters.assigneeId },
          },
        }),
        project: {
          OR: [
            { ownerId: userId },
            {
              members: { some: { id: userId } },
            },
          ],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  private async checkOwnership(projectId: string, userId: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include: {
        members: true,
      },
    });

    if (!project) {
      throw new NotFoundException(this.i18n.t("error.project_not_found"));
    }
    if (
      project.ownerId !== userId &&
      project.members.some((member) => member.id === userId)
    ) {
      throw new ForbiddenException(this.i18n.t("error.user_dont_have_access"));
    }
    return project;
  }
}
