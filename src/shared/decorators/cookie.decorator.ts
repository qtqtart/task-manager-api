import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const cookies = request.cookies || {};

    if (!key) return cookies;
    return cookies[key] ?? null;
  },
);
