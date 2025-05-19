import { Authorization } from "@entities/auth/decorators/authorization.decorator";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileValidationPipe } from "@shared/pipes/file-validation.pipe";
import { GraphqlContext } from "@shared/types/graphql.types";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import Upload from "graphql-upload/Upload.mjs";

import { TaskFileModel } from "./task-file.model";
import { TaskFilesService } from "./task-files.service";

@Authorization()
@Resolver()
export class TaskFilesResolver {
  constructor(private readonly taskFilesService: TaskFilesService) {}

  @Query(() => [TaskFileModel])
  public async getAllTaskFiles(@Args("taskId") taskId: string) {
    return await this.taskFilesService.getAll(taskId);
  }
  @Mutation(() => Boolean)
  public async uploadTaskFile(
    @Args("taskId") taskId: string,
    @Context() { req }: GraphqlContext,
    @Args("file", { type: () => GraphQLUpload }, FileValidationPipe)
    file: Upload,
  ) {
    return await this.taskFilesService.uploadFile(taskId, req.user.id, file);
  }
  @Mutation(() => Boolean)
  public async removeTaskFile(
    @Args("taskFileId") taskFileId: string,
    @Context() { req }: GraphqlContext,
  ) {
    return await this.taskFilesService.removeFile(taskFileId, req.user.id);
  }
}
