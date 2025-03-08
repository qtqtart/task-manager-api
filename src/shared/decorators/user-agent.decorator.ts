import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const { headers } = request;

    return headers['user-agent'];
  },
);
