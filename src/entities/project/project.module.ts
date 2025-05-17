import { S3Service } from "@app/s3/s3.service";
import { Module } from "@nestjs/common";

import { ProjectResolver } from "./project.resolver";
import { ProjectService } from "./project.service";

@Module({
  providers: [ProjectResolver, ProjectService, S3Service],
  exports: [ProjectService],
})
export class ProjectModule {}
