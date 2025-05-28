import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { I18nService } from "nestjs-i18n";

import { I18nTranslations } from "~_i18n";
import { PrismaService } from "~app/prisma/prisma.service";
import { USER_SELECT } from "~modules/user/user.consts";

import { CreateProjectDto } from "./dtos/create-project.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";

const include = {
  owner: {
    select: {
      ...USER_SELECT,
    },
  },
  members: {
    select: {
      ...USER_SELECT,
    },
  },
};

@Injectable()
export class ProjectService {
  constructor(
    private prismaService: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async getAll(
    searchTerms: string,
    isArchived: boolean,
    userId: string,
  ) {
    return await this.prismaService.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            members: {
              some: { id: userId },
            },
          },
        ],
        ...(searchTerms && {
          title: { contains: searchTerms, mode: "insensitive" },
        }),
        ...(isArchived && {
          isArchived,
        }),
      },
      orderBy: {
        updatedAt: "desc",
      },
      include,
    });
  }

  public async create(dto: CreateProjectDto, userId: string) {
    if (dto.title) {
      await this.checkUnique(dto.title);
    }
    if (dto.memberIds.includes(userId)) {
      throw new ConflictException(this.i18n.t("error.owner_cannot_be_member"));
    }
    if (dto.memberIds.length > 0) {
      await this.checkMembers(dto.memberIds);
    }

    return await this.prismaService.project.create({
      data: {
        title: dto.title,
        description: dto.description,
        imageUrl: dto.imageUrl,
        owner: {
          connect: { id: userId },
        },
        members: {
          connect: dto.memberIds.map((id) => ({ id })) || [],
        },
      },
      include,
    });
  }

  public async update(
    projectId: string,
    dto: UpdateProjectDto,
    userId: string,
  ) {
    await this.checkOwnership(projectId, userId);
    if (dto.title) {
      await this.checkUnique(dto.title);
    }
    if (dto.memberIds?.includes(userId)) {
      throw new ConflictException(this.i18n.t("error.owner_cannot_be_member"));
    }
    if (dto.memberIds?.length > 0) {
      await this.checkMembers(dto.memberIds);
    }

    return await this.prismaService.project.update({
      where: { id: projectId },
      data: {
        title: dto.title,
        description: dto.description,
        isArchived: dto.isArchived,
        imageUrl: dto.imageUrl,
        ...(dto.memberIds?.length > 0 && {
          members: {
            set: dto.memberIds.map((id) => ({ id })),
          },
        }),
      },
      include,
    });
  }

  public async checkOwnership(projectId: string, userId: string) {
    const project = await this.prismaService.project.findUnique({
      where: { id: projectId },
      include,
    });

    if (!project) {
      throw new NotFoundException(this.i18n.t("error.project_not_found"));
    }
    if (project.ownerId !== userId) {
      throw new ForbiddenException(this.i18n.t("error.user_dont_have_access"));
    }
    return project;
  }

  private async checkUnique(title: string) {
    const project = await this.prismaService.project.findFirst({
      where: {
        title,
      },
    });

    if (!project) return;
    throw new ConflictException(
      this.i18n.t("error.existing_project_by_title", {
        args: {
          title,
        },
      }),
    );
  }

  private async checkMembers(memberIds: string[]) {
    const count = await this.prismaService.user.count({
      where: {
        id: { in: [...new Set(memberIds)] },
      },
    });
    if (count !== new Set(memberIds).size) {
      throw new NotFoundException(this.i18n.t("error.users_not_found"));
    }
  }
}
