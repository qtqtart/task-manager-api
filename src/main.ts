import { AppModule } from "@app/app.module";
import { EnvironmentService } from "@app/environment/environment.service";
import { RedisService } from "@app/redis/redis.service";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { RedisStore } from "connect-redis";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import graphqlUpload from "graphql-upload/graphqlUploadExpress.mjs";
import * as ms from "ms";

(async () => {
  const application = await NestFactory.create(AppModule);
  const environmentService = application.get(EnvironmentService);
  const redis = application.get(RedisService);

  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  application.use(cookieParser(environmentService.get("COOKIE_SECRET")));
  application.use(environmentService.get("GRAPHQL_PREFIX"), graphqlUpload());
  application.use(
    session({
      name: environmentService.get("SESSION_NAME"),
      secret: environmentService.get("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: "lax",
        domain: environmentService.get("SESSION_DOMAIN"),
        httpOnly: environmentService.get("SESSION_HTTP_ONLY"),
        secure: environmentService.get("SESSION_SECURE"),
        maxAge: ms(environmentService.get("SESSION_MAX_AGE") as ms.StringValue),
      },
      store: new RedisStore({
        client: redis,
        prefix: environmentService.get("SESSION_FOLDER"),
      }),
    }),
  );

  application.enableCors({
    credentials: true,
    origin: environmentService.get("ALLOWED_ORIGIN"),
    exposedHeaders: ["set-cookie"],
  });

  await application.listen(environmentService.get("APPLICATION_PORT"));
})();
