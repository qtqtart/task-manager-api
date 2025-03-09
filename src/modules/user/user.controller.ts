import { CurrentUserId } from '@shared/decorators/current-user-id.decorator';

import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async me(@CurrentUserId() id: string) {
    return await this.userService.getById(id);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.userService.getAll();
  }
}
