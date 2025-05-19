import { Authorization } from "@entities/auth/decorators/authorization.decorator";
import { UserModel } from "@entities/user/user.model";
import { Context, Query, Resolver } from "@nestjs/graphql";
import { GraphqlContext } from "@shared/types/graphql.types";

import { AccountService } from "./account.service";

@Resolver("Account")
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Authorization()
  @Query(() => UserModel, {
    name: "getCurrentUser",
  })
  public async getCurrentUser(@Context() { req }: GraphqlContext) {
    return this.accountService.getCurrent(req);
  }
}
