import { CurrentUserId } from '@shared/decorators/current-user-id.decorator';

import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }
}
