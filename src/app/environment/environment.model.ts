import { ToBoolean } from "@shared/decorators/to-boolean.decorator";
import { ToNumber } from "@shared/decorators/to-number.decorator";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

import { Environment } from "./environment.types";

export class EnvironmentModel implements Environment {
  @ToNumber()
  @IsNumber()
  APPLICATION_PORT: number;
  @IsNotEmpty()
  @IsString()
  ALLOWED_ORIGIN: string;
  //
  @IsNotEmpty()
  @IsString()
  COOKIE_SECRET: string;
  @IsNotEmpty()
  @IsString()
  SESSION_SECRET: string;
  @IsNotEmpty()
  @IsString()
  SESSION_NAME: string;
  @IsNotEmpty()
  @IsString()
  SESSION_DOMAIN: string;
  @IsNotEmpty()
  @IsString()
  SESSION_MAX_AGE: string;
  @ToBoolean()
  @IsBoolean()
  SESSION_HTTP_ONLY: boolean;
  @ToBoolean()
  @IsBoolean()
  SESSION_SECURE: boolean;
  @IsNotEmpty()
  @IsString()
  SESSION_FOLDER: string;
  //
  @IsNotEmpty()
  @IsString()
  POSTGRES_USER: string;
  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;
  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;
  @ToNumber()
  @IsNumber()
  POSTGRES_PORT: number;
  @IsNotEmpty()
  @IsString()
  POSTGRES_DB: string;
  @IsNotEmpty()
  @IsString()
  POSTGRES_URL: string;
  //
  @IsNotEmpty()
  @IsString()
  S3_USER: string;
  @IsNotEmpty()
  @IsString()
  S3_PASSWORD: string;
  @ToNumber()
  @IsNumber()
  S3_PORT: number;
  @ToNumber()
  @IsNumber()
  S3_CONSOLE_PORT: number;
  @IsNotEmpty()
  @IsString()
  S3_BUCKET: string;
  @IsNotEmpty()
  @IsString()
  S3_ENDPOINT: string;
  @IsNotEmpty()
  @IsString()
  S3_REGION: string;
  @IsNotEmpty()
  @IsString()
  S3_ACCESS_KEY_ID: string;
  @IsNotEmpty()
  @IsString()
  S3_SECRET_ACCESS_KEY: string;
  //
  @IsNotEmpty()
  @IsString()
  REDIS_USER: string;
  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD: string;
  @IsNotEmpty()
  @IsString()
  REDIST_HOST: string;
  @ToNumber()
  @IsNumber()
  REDIS_PORT: number;
  @IsNotEmpty()
  @IsString()
  REDIS_URL: string;
}
