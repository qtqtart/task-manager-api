import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { FileValidationPipe } from "@shared/pipes/file-validation.pipe";
import { GraphqlContext } from "@shared/types/graphql.types";
import GraphQLUpload, { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

import { AuthService } from "./auth.service";
import { SignInInput } from "./inputs/sign-in.input";
import { SignUpInput } from "./inputs/sign-up.input";

@Resolver("Auth")
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean)
  public async signIn(
    @Context() { req }: GraphqlContext,
    @Args("input") input: SignInInput,
  ) {
    return await this.authService.singIn(req, input);
  }
  @Mutation(() => Boolean)
  public async singUp(
    @Context() { req }: GraphqlContext,
    @Args("input") input: SignUpInput,
    @Args("file", { type: () => GraphQLUpload }, FileValidationPipe)
    file: FileUpload,
  ) {
    return await this.authService.singUp(req, input, file);
  }
  @Mutation(() => Boolean)
  public async signOut(@Context() { req }: GraphqlContext) {
    return await this.authService.singOut(req);
  }
}
