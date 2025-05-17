import { Module } from "@nestjs/common";

import { TaskFilesResolver } from "./task-files.resolver";
import { TaskFilesService } from "./task-files.service";

@Module({
  providers: [TaskFilesResolver, TaskFilesService],
})
export class TaskFilesModule {}
