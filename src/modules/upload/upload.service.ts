import { Injectable, NotFoundException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { v4 as uuid } from "uuid";

import { I18nTranslations } from "~_i18n";
import { S3Service } from "~app/s3/s3.service";

@Injectable()
export class UploadService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  public async upload(file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException(this.i18n.t("error.file_not_found"));
    }

    const key = `${file.originalname}_${uuid()}`;
    return await this.s3Service.upload(file.buffer, key, file.mimetype);
  }
}
