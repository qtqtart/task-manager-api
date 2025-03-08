import { METADATA_KEYS } from '@shared/consts/metadata-keys';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.PUBLIC,
      [context.getHandler(), context.getClass()],
    );

    return isPublic;
  }
}
