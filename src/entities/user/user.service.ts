import { PrismaService } from "@app/prisma/prisma.service";
import { S3Service } from "@app/s3/s3.service";
import { ConflictException, Injectable } from "@nestjs/common";
import { processBuffer } from "@shared/utils/process-buffer.utils";
import { hash } from "argon2";
import { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

import { CreateUserInput } from "./inputs/create-user.input";
import { USER_SELECT } from "./user.consts";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  public async getById(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: USER_SELECT,
    });
  }
  public async getAll(userId: string) {
    return await this.prismaService.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: USER_SELECT,
    });
  }
  public async create(input: CreateUserInput, file: FileUpload) {
    await this.checkUniqUsername(input);
    await this.checkUniqEmail(input);
    const { minetype, buffer } = await processBuffer(file);
    const imageUrl = await this.s3Service.upload(
      buffer,
      `/user/${Date.now()}-${file.filename}`,
      minetype,
    );

    const password = await hash(input.password);
    return await this.prismaService.user.create({
      data: {
        ...input,
        imageUrl,
        password,
      },
      select: USER_SELECT,
    });
  }

  private async checkUniqUsername(input: CreateUserInput) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: input.username,
      },
    });
    if (user) {
      throw new ConflictException("username already exist by username");
    }
  }
  private async checkUniqEmail(input: CreateUserInput) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: input.email,
      },
    });
    if (user) {
      throw new ConflictException("email already exist by email");
    }
  }
}
