export interface Environment {
  APPLICATION_PORT: number;
  ALLOWED_ORIGIN: string;
  //
  COOKIE_SECRET: string;
  SESSION_SECRET: string;
  SESSION_NAME: string;
  SESSION_DOMAIN: string;
  SESSION_MAX_AGE: string;
  SESSION_HTTP_ONLY: boolean;
  SESSION_SECURE: boolean;
  SESSION_FOLDER: string;
  //
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_DB: string;
  POSTGRES_URL: string;
  //
  S3_USER: string;
  S3_PASSWORD: string;
  S3_PORT: number;
  S3_CONSOLE_PORT: number;
  S3_BUCKET: string;
  S3_ENDPOINT: string;
  S3_REGION: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  //
  REDIS_USER: string;
  REDIS_PASSWORD: string;
  REDIST_HOST: string;
  REDIS_PORT: number;
  REDIS_URL: string;
}
