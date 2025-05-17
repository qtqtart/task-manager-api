import { S3Service } from "@app/s3/s3.service";
import { Module } from "@nestjs/common";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  providers: [UserResolver, UserService, S3Service],
  exports: [UserService],
})
export class UserModule {}
