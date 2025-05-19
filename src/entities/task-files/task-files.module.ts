import { S3Service } from "@app/s3/s3.service";
import { Module } from "@nestjs/common";

import { TaskFilesResolver } from "./task-files.resolver";
import { TaskFilesService } from "./task-files.service";

@Module({
  providers: [TaskFilesResolver, TaskFilesService, S3Service],
})
export class TaskFilesModule {}
