import { AccountModule } from "@entities/account/account.module";
import { AuthModule } from "@entities/auth/auth.module";
import { ProjectModule } from "@entities/project/project.module";
import { SessionModule } from "@entities/session/session.module";
import { TaskModule } from "@entities/task/task.module";
import { TaskFilesModule } from "@entities/task-files/task-files.module";
import { UserModule } from "@entities/user/user.module";
import { ApolloDriver } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { getGraphQLConfig } from "@shared/configs/graphql.config";

import { EnvironmentModule } from "./environment/environment.module";
import { EnvironmentService } from "./environment/environment.service";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { S3Module } from "./s3/s3.module";
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      useFactory: getGraphQLConfig,
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
    }),
    //
    EnvironmentModule,
    PrismaModule,
    RedisModule,
    S3Module,
    //
    AccountModule,
    AuthModule,
    ProjectModule,
    SessionModule,
    TaskModule,
    TaskFilesModule,
    UserModule,
  ],
})
export class AppModule {}
