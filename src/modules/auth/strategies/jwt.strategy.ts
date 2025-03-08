import { EnvironmentService } from '@app/environment/environment.service';
import { PrismaService } from '@app/prisma/prisma.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environmentService.get('JWT_SECRET'),
    });
  }

  async validate(jwtPayload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: jwtPayload.id,
      },
    });

    if (!user) throw new UnauthorizedException();

    return jwtPayload;
  }
}
