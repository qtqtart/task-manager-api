import { S3Service } from "@app/s3/s3.service";
import { UserService } from "@entities/user/user.service";
import { Module } from "@nestjs/common";

import { AccountResolver } from "./account.resolver";
import { AccountService } from "./account.service";

@Module({
  providers: [AccountResolver, AccountService, S3Service, UserService],
})
export class AccountModule {}
