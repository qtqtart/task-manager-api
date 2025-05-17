import { PrismaService } from "@app/prisma/prisma.service";
import { ProjectService } from "@entities/project/project.service";
import { USER_SELECT } from "@entities/user/user.consts";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateTaskInput } from "./inputs/create-task.input";
import { TaskFiltersInput } from "./inputs/task-filters.input";
import { UpdateTaskInput } from "./inputs/update-task.input";

@Injectable()
export class TaskService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  public async getById(taskId: string) {
    return await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        user: { select: USER_SELECT },
        taskAssignee: { select: USER_SELECT },
      },
    });
  }
  public async getAll(projectId: string, filters?: TaskFiltersInput) {
    return await this.prismaService.task.findMany({
      where: {
        projectId,
        ...(filters?.userId && {
          userId: filters?.userId,
        }),
        ...(filters?.state && {
          state: filters?.state,
        }),
        ...(filters?.priority && {
          priority: filters?.priority,
        }),
        ...(filters?.startDate && {
          startDate: {
            gte: filters?.startDate,
          },
        }),
        ...(filters?.endDate && {
          endDate: {
            lte: filters?.endDate,
          },
        }),
        ...(filters?.searchTerms && {
          title: {
            contains: filters?.searchTerms,
            mode: "insensitive",
          },
        }),
      },
      include: {
        user: { select: USER_SELECT },
        taskAssignee: { select: USER_SELECT },
      },
    });
  }
  public async create(
    projectId: string,
    userId: string,
    input: CreateTaskInput,
  ) {
    await this.checkUniqTitle(input);
    if (input.assigneeIds) {
      await this.checkTaskAssigneeIds(input);
    }
    await this.checkProjectId(projectId, userId);

    await this.prismaService.$transaction(async () => {
      const task = await this.prismaService.task.create({
        data: {
          ...input,
          userId,
          projectId,
        },
      });

      await this.prismaService.taskAssignee.createMany({
        data: input.assigneeIds.map((assigneeId) => ({
          userId: assigneeId,
          taskId: task.id,
        })),
        skipDuplicates: true,
      });
    });
    return true;
  }
  public async update(taskId: string, userId: string, input: UpdateTaskInput) {
    const task = await this.getById(taskId);
    if (!task) {
      throw new NotFoundException("task not found");
    }
    if (input.title) {
      await this.checkUniqTitle(input);
    }
    if (input.assigneeIds) {
      await this.checkTaskAssigneeIds(input);
    }

    await this.prismaService.$transaction(async () => {
      await this.prismaService.task.update({
        where: {
          id: taskId,
        },
        data: {
          ...input,
        },
      });

      if (input.assigneeIds) {
        await this.prismaService.taskAssignee.deleteMany({
          where: {
            taskId,
          },
        });

        const assigneeIds = input.assigneeIds.map((assigneeId) => ({
          userId: assigneeId,
          taskId,
        }));
        await this.prismaService.taskAssignee.createMany({
          data: {
            ...assigneeIds,
          },
          skipDuplicates: true,
        });
      }
    });
    return true;
  }

  private async checkUniqTitle(input: CreateTaskInput | UpdateTaskInput) {
    const task = await this.prismaService.task.findUnique({
      where: {
        title: input.title,
      },
    });
    if (task) {
      throw new ConflictException("task already exist by title");
    }
    return;
  }
  private async checkTaskAssigneeIds(input: CreateTaskInput | UpdateTaskInput) {
    const users = await this.prismaService.user.count({
      where: {
        id: { in: input.assigneeIds },
      },
    });
    if (users !== input.assigneeIds.length) {
      throw new ConflictException("invalid task assignees list");
    }
    return;
  }
  private async checkProjectId(projectId: string, userId: string) {
    const projects = await this.projectService.getAll(userId);
    if (!projects.find((project) => project.id === projectId)) {
      throw new ConflictException("u dont access to project");
    }
    return;
  }
}
