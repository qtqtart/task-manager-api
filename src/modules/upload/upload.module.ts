import { Module } from "@nestjs/common";

import { S3Module } from "~app/s3/s3.module";

import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

@Module({
  imports: [S3Module],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
