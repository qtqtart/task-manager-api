import { PrismaService } from "@app/prisma/prisma.service";
import { S3Service } from "@app/s3/s3.service";
import { USER_SELECT } from "@entities/user/user.consts";
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { getBuffer } from "@shared/utils/get-buffer.utils";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

@Injectable()
export class TaskFilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  public async getAll(taskId: string) {
    return await this.prismaService.taskFile.findMany({
      where: {
        id: taskId,
      },
      include: {
        user: { select: USER_SELECT },
      },
    });
  }

  public async uploadFile(taskId: string, userId: string, file: FileUpload) {
    const buffer = await getBuffer(file);
    const url = await this.s3Service.upload(
      buffer,
      `/task-file/${Date.now()}-${file.filename}`,
      file.mimetype,
    );

    await this.prismaService.taskFile.create({
      data: {
        fileName: file.filename,
        fileType: file.mimetype,
        size: buffer.length,
        url,
        taskId,
        userId,
      },
    });
    return true;
  }
  public async removeFile(taskFileId: string, userId: string) {
    const file = await this.prismaService.taskFile.findUnique({
      where: {
        id: taskFileId,
      },
      include: { task: true },
    });
    if (!file) {
      throw new NotFoundException("task file not found");
    }
    if (file.userId !== userId) {
      throw new ForbiddenException("u can only delete your own files");
    }

    const key = new URL(file.url).pathname.substring(1);

    await this.prismaService.$transaction(async () => {
      await this.prismaService.taskFile.delete({
        where: {
          id: taskFileId,
        },
      });
      await this.s3Service.remove(key);
    });
  }
}
