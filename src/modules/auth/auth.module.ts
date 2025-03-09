import { EnvironmentService } from '@app/environment/environment.service';
import { TokenService } from '@modules/token/token.service';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy, JwtGuard],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (environmentService: EnvironmentService) => ({
        global: true,
        secret: environmentService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: environmentService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [EnvironmentService],
    }),
  ],
})
export class AuthModule {}
