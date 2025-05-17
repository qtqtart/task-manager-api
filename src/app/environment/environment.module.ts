import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validate } from "class-validator";

import { EnvironmentService } from "./environment.service";
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
