import { Module } from "@nestjs/common";

import { EnvironmentModule } from "./environment/environment.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { S3Module } from "./s3/s3.module";
@Module({
  imports: [EnvironmentModule, PrismaModule, RedisModule, S3Module],
})
export class AppModule {}
