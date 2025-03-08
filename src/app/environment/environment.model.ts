import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ToBoolean } from './decorators/to-boolean.decorator';
import { ToPositiveNumber } from './decorators/to-positive-number.decorator';
import { Environment } from './environment.types';

export class EnvironmentModel implements Environment {
  @IsNotEmpty()
  @IsString()
  ALLOWED_ORIGIN: string;

  @ToPositiveNumber()
  @IsNumber()
  @Min(0)
  @Max(65535)
  APPLICATION_PORT: number;

  @IsNotEmpty()
  @IsString()
  APPLICATION_HOST: string;

  @IsNotEmpty()
  @IsString()
  APPLICATION_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES_IN: string;

  @ToBoolean()
  @IsBoolean()
  COOKIE_HTTP_ONLY: boolean;

  @ToBoolean()
  @IsBoolean()
  COOKIE_SECURE: boolean;

  @ToPositiveNumber()
  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_DB: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @ToPositiveNumber()
  @IsNumber()
  @Min(0)
  @Max(65535)
  S3_PORT: number;

  @ToPositiveNumber()
  @IsNumber()
  @Min(0)
  @Max(65535)
  S3_CONSOLE_PORT: number;

  @IsNotEmpty()
  @IsString()
  S3_ROOT_USER: string;

  @IsNotEmpty()
  @IsString()
  S3_ROOT_PASSWORD: string;

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
}
