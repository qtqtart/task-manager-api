import { Authorization } from "@entities/auth/decorators/authorization.decorator";
import { Context, Query, Resolver } from "@nestjs/graphql";
import { GraphqlContext } from "@shared/types/graphql.types";

import { UserModel } from "./user.model";
import { UserService } from "./user.service";

@Authorization()
@Resolver("Users")
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserModel])
  public async getAllUsers(@Context() { req }: GraphqlContext) {
    return await this.userService.getAll(req.user.id);
  }
}
