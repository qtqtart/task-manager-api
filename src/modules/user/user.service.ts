import { PrismaService } from '@app/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { UserResponseDto } from './dtos/user-reponse.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return plainToInstance(UserResponseDto, user);
  }

  async getAll() {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => plainToInstance(UserResponseDto, user));
  }
}
