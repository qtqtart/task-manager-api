import { Module } from "@nestjs/common";
import { CookieResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { join } from "path";

import { AccountModule } from "~modules/account/account.module";
import { AuthModule } from "~modules/auth/auth.module";
import { ProjectModule } from "~modules/project/project.module";
import { SessionModule } from "~modules/session/session.module";
import { TaskModule } from "~modules/task/task.module";
import { UploadModule } from "~modules/upload/upload.module";
import { UserModule } from "~modules/user/user.module";
import { COOKIES_KEYS } from "~shared/consts/cookies-keys";
import { FALLBACK_LANGUAGE } from "~shared/consts/languages";

import { EnvironmentModule } from "./environment/environment.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { S3Module } from "./s3/s3.module";

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: FALLBACK_LANGUAGE,
      loaderOptions: {
        path: join(__dirname, "../_i18n/"),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: [COOKIES_KEYS.LANG],
        },
        new CookieResolver([COOKIES_KEYS.LANG]),
      ],
      typesOutputPath: join(process.cwd(), "src/_i18n/index.ts"),
      throwOnMissingKey: false,
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
    UploadModule,
    UserModule,
  ],
})
export class AppModule {}
