import { CurrentUserId } from '@shared/decorators/current-user-id.decorator';

import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MeService } from './me.service';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async me(@CurrentUserId() id: string) {
    return await this.meService.me(id);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(
    @CurrentUserId() id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.meService.addImage(id, file);
  }

  @Delete('image')
  async removeImage(@CurrentUserId() id: string) {
    return await this.meService.removeImage(id);
  }
}
