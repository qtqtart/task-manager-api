import { applyDecorators, UseGuards } from "@nestjs/common";

import { GraphQLAuthGuard } from "../guards/grapql-auth.guard";

export const Authorization = () => applyDecorators(UseGuards(GraphQLAuthGuard));
