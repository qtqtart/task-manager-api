import { ConflictException, Injectable } from "@nestjs/common";
import { hash } from "argon2";
import { I18nService } from "nestjs-i18n";

import { I18nTranslations } from "~_i18n";
import { PrismaService } from "~app/prisma/prisma.service";

import { CreateUserDto } from "./dtos/create-user.dto";
import { USER_SELECT } from "./user.consts";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async getById(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        ...USER_SELECT,
      },
    });
  }

  public async getAll(userId: string) {
    return await this.prismaService.user.findMany({
      where: {
        id: {
          not: userId,
        },
      },
      select: {
        ...USER_SELECT,
      },
    });
  }

  public async create(dto: CreateUserDto) {
    await this.checkUnique(dto);
    const password = await hash(dto.password);
    return await this.prismaService.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        imageUrl: dto.imageUrl,
        password,
      },
      select: {
        ...USER_SELECT,
      },
    });
  }

  private async checkUnique(dto: CreateUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (!user) return;
    if (user.username === dto.username) {
      throw new ConflictException(
        this.i18n.t("error.existing_user_by_username", {
          args: { username: dto.username },
        }),
      );
    }
    if (user.email === dto.email) {
      throw new ConflictException(
        this.i18n.t("error.existing_user_by_email", {
          args: { email: dto.email },
        }),
      );
    }
  }
}
