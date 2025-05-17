import { S3Service } from "@app/s3/s3.service";
import { SessionService } from "@entities/session/session.service";
import { UserService } from "@entities/user/user.service";
import { Module } from "@nestjs/common";

import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";

@Module({
  providers: [
    AuthResolver,
    AuthService,
    SessionService,
    S3Service,
    UserService,
  ],
})
export class AuthModule {}
