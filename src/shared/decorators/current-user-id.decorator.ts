import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const { user } = request;
    return user.id;
  },
);
