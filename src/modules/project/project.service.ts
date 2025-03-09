import { PrismaService } from '@app/prisma/prisma.service';
import { S3Service } from '@app/s3/s3.service';

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProjectDto } from './dtos/create-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';

@Injectable()
export class ProjectService {
  private readonly include = {
    include: {
      projectMembers: true,
      tags: true,
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  };

  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async getById(id: string) {
    const project = await this.prismaService.project.findUnique({
      where: {
        id,
      },
      ...this.include,
    });

    return project;
  }

  async getProjects(userId: string, contains: string) {
    const projects = await this.prismaService.project.findMany({
      where: {
        AND: [
          {
            projectMembers: {
              some: {
                userId,
              },
            },
          },
          {
            title: {
              contains,
              mode: 'insensitive',
            },
          },
        ],
      },
      ...this.include,
    });

    return projects;
  }

  async create(
    userId: string,
    dto: CreateProjectDto,
    file?: Express.Multer.File,
  ) {
    const isExistProject = await this.prismaService.project.findUnique({
      where: {
        title: dto.title,
      },
    });

    if (isExistProject)
      throw new ConflictException('project already exist with title');

    const newProject = await this.prismaService.project.create({
      data: {
        ...dto,
        userId,
        projectMembers: {},
      },
      ...this.include,
    });

    await this.prismaService.projectMember.create({
      data: {
        userId,
        projectId: newProject.id,
      },
    });

    if (dto.userIds && dto.userIds.length > 0)
      await this.prismaService.projectMember.createMany({
        data: {
          ...dto.userIds.map((userId) => ({
            userId,
            projectId: newProject.id,
          })),
        },
      });

    if (file) {
      const key = `${newProject.id}/image/${file.originalname}`;
      await this.s3Service.upload(file.buffer, key, file.mimetype);
      const imageUrl = this.s3Service.keyToImageUrl(key);

      await this.prismaService.project.update({
        where: {
          id: newProject.id,
        },
        data: {
          imageUrl,
        },
      });
    }

    return newProject;
  }

  async update(id: string, dto: UpdateProjectDto, file?: Express.Multer.File) {
    const isExistProject = await this.prismaService.project.findUnique({
      where: {
        title: dto.title,
      },
    });

    if (isExistProject)
      throw new ConflictException('project already exist with title');

    const project = await this.getById(id);

    if (project.imageUrl) {
      const key = this.s3Service.imageUrlToKey(project.imageUrl);
      this.s3Service.remove(key);
    }

    const key = `${project.id}/image/${file.originalname}`;
    await this.s3Service.upload(file.buffer, key, file.mimetype);
    const imageUrl = this.s3Service.keyToImageUrl(key);

    const newProject = await this.prismaService.project.update({
      where: {
        id,
      },
      data: {
        ...dto,
        imageUrl,
      },
      ...this.include,
    });

    if (dto.userIds && dto.userIds.length > 0) {
      const userIds = await this.prismaService.projectMember
        .findMany({
          where: {
            id: newProject.id,
          },
          select: {
            userId: true,
          },
        })
        .then((_) => _.map(({ userId }) => userId));

      const userIdsToRemove = userIds.filter(
        (userId) => !dto.userIds.includes(userId),
      );

      if (userIdsToRemove.length > 0)
        await this.prismaService.projectMember.deleteMany({
          where: {
            projectId: newProject.id,
            userId: {
              in: userIdsToRemove,
            },
          },
        });

      const userIdsToAdd = dto.userIds.filter(
        (userId) => !userIds.includes(userId),
      );

      if (userIdsToAdd.length > 0)
        await this.prismaService.projectMember.createMany({
          data: {
            ...userIdsToAdd.map((userId) => ({
              projectId: newProject.id,
              userId,
            })),
          },
        });
    }

    return newProject;
  }

  async toggleArchive(id: string) {
    const isExistProject = await this.getById(id);

    if (!isExistProject) throw new NotFoundException('project not found by id');

    const newProject = await this.prismaService.project.update({
      where: {
        id,
      },
      data: {
        isArchived: !isExistProject.isArchived,
      },
      ...this.include,
    });

    return newProject;
  }
}
