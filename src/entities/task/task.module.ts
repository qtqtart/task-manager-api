import { S3Service } from "@app/s3/s3.service";
import { ProjectService } from "@entities/project/project.service";
import { Module } from "@nestjs/common";

import { TaskResolver } from "./task.resolver";
import { TaskService } from "./task.service";

@Module({
  providers: [TaskResolver, TaskService, ProjectService, S3Service],
})
export class TaskModule {}
