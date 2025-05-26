import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { EnvironmentService } from "./environment.service";
import { validate } from "./environment.utils";
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
      cache: true,
      validate,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
