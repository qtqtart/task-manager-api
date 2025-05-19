import { PrismaService } from "@app/prisma/prisma.service";
import { S3Service } from "@app/s3/s3.service";
import { USER_SELECT } from "@entities/user/user.consts";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { processBuffer } from "@shared/utils/process-buffer.utils";
import Upload from "graphql-upload/Upload.mjs";

import { CreateProjectInput } from "./inputs/create-project.input";
import { ProjectFiltersInput } from "./inputs/project-filters.input";
import { UpdateProjectInput } from "./inputs/update-project.input";

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  public async getById(projectId: string) {
    return this.prismaService.project.findUnique({
      where: { id: projectId },
      include: {
        projectMembers: { select: USER_SELECT },
        user: { select: USER_SELECT },
      },
    });
  }
  public async getAll(userId: string, filters?: ProjectFiltersInput) {
    return await this.prismaService.project.findMany({
      where: {
        OR: [
          { userId },
          {
            projectMembers: {
              some: { userId },
            },
          },
        ],
        ...(filters?.isArchived !== undefined && {
          isArchived: filters.isArchived,
        }),
        ...(filters?.searchTerms && {
          title: {
            contains: filters.searchTerms,
            mode: "insensitive",
          },
        }),
      },
      include: {
        projectMembers: { select: USER_SELECT },
        user: { select: USER_SELECT },
      },
    });
  }
  public async create(
    userId: string,
    input: CreateProjectInput,
    { file }: Upload,
  ) {
    await this.checkUniqTitle(input);
    if (input.memberIds) {
      await this.checkProjectMemberIds(userId, input);
    }

    const { minetype, buffer } = await processBuffer(file);
    const imageUrl = await this.s3Service.upload(
      buffer,
      `/project/${Date.now()}-${file.filename}`,
      minetype,
    );

    await this.prismaService.$transaction(async () => {
      const project = await this.prismaService.project.create({
        data: {
          ...input,
          imageUrl,
          userId,
        },
      });

      await this.prismaService.projectMember.createMany({
        data: input.memberIds.map((projectMemberId) => ({
          userId: projectMemberId,
          projectId: project.id,
        })),
        skipDuplicates: true,
      });
    });
    return true;
  }
  public async update(
    projectId: string,
    userId: string,
    input: UpdateProjectInput,
    { file }: Upload,
  ) {
    const project = await this.getById(projectId);
    if (!project) {
      throw new NotFoundException("project not found");
    }
    if (input.title) {
      await this.checkUniqTitle(input);
    }
    if (input.memberIds) {
      await this.checkProjectMemberIds(userId, input);
    }
    if (file) {
      const key = new URL(project.imageUrl).pathname.substring(1);
      await this.s3Service.remove(key);
    }

    const { minetype, buffer } = await processBuffer(file);
    const imageUrl = await this.s3Service.upload(
      buffer,
      `/project/${Date.now()}-${file.filename}`,
      minetype,
    );

    await this.prismaService.$transaction(async () => {
      await this.prismaService.project.update({
        where: {
          id: projectId,
        },
        data: {
          ...input,
          imageUrl,
        },
      });

      if (input.memberIds) {
        await this.prismaService.projectMember.deleteMany({
          where: {
            projectId,
          },
        });

        const memberIds = input.memberIds.map((userId) => ({
          userId,
          projectId,
        }));
        await this.prismaService.projectMember.createMany({
          data: {
            ...memberIds,
          },
          skipDuplicates: true,
        });
      }
    });
    return true;
  }

  private async checkUniqTitle(input: CreateProjectInput | UpdateProjectInput) {
    const project = await this.prismaService.project.findUnique({
      where: {
        title: input.title,
      },
    });
    if (project) {
      throw new ConflictException("project already exist by title");
    }
    return;
  }
  private async checkProjectMemberIds(
    userId: string,
    input: CreateProjectInput | UpdateProjectInput,
  ) {
    const users = await this.prismaService.user.count({
      where: {
        id: { in: input.memberIds },
      },
    });
    if (users !== input.memberIds.length) {
      throw new ConflictException("invalid project members list");
    }
    if (input.memberIds.includes(userId)) {
      throw new ConflictException(
        "creator should not be included in project members list",
      );
    }
    return;
  }
}
