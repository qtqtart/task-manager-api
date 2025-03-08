export interface Environment {
  ALLOWED_ORIGIN: string;

  APPLICATION_PORT: number;
  APPLICATION_HOST: string;
  APPLICATION_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  COOKIE_HTTP_ONLY: boolean;
  COOKIE_SECURE: boolean;

  DATABASE_PORT: number;
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_DB: string;
  DATABASE_URL: string;

  S3_PORT: number;
  S3_CONSOLE_PORT: number;
  S3_ROOT_USER: string;
  S3_ROOT_PASSWORD: string;
  S3_BUCKET: string;
  S3_ENDPOINT: string;
  S3_REGION: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
}
