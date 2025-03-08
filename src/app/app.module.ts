import { AuthModule } from '@modules/auth/auth.module';
import { JwtGuard } from '@modules/auth/guards/jwt.guard';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { EnvironmentModule } from './environment/environment.module';
import { PrismaModule } from './prisma/prisma.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [EnvironmentModule, PrismaModule, AuthModule, S3Module],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
