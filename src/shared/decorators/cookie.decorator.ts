import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (key: string, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const { cookies } = request;

    if (!key) return cookies;

    return key in cookies ? cookies[key] : null;
  },
);
