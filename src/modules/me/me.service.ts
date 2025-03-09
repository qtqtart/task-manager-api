import { PrismaService } from '@app/prisma/prisma.service';
import { S3Service } from '@app/s3/s3.service';
import { UserResponseDto } from '@modules/user/dtos/user-reponse.dto';
import { UserService } from '@modules/user/user.service';

import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly userService: UserService,
  ) {}

  async me(id: string) {
    return await this.userService.getById(id);
  }

  async addImage(id: string, file: Express.Multer.File) {
    const user = await this.me(id);

    if (user.imageUrl) {
      const key = this.s3Service.imageUrlToKey(user.imageUrl);
      await this.s3Service.remove(key);
    }

    const key = `${user.id}/image/${file.originalname}`;
    await this.s3Service.upload(file.buffer, key, file.mimetype);
    const imageUrl = this.s3Service.keyToImageUrl(key);

    const newUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        imageUrl,
      },
    });

    return plainToInstance(UserResponseDto, newUser);
  }

  async removeImage(id: string) {
    const user = await this.me(id);

    if (!user.imageUrl) return;

    const key = this.s3Service.imageUrlToKey(user.imageUrl);
    await this.s3Service.remove(key);

    const newUser = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        imageUrl: null,
      },
    });

    return plainToInstance(UserResponseDto, newUser);
  }
}
