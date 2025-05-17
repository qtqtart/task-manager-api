import { Authorization } from "@entities/auth/decorators/authorization.decorator";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileValidationPipe } from "@shared/pipes/file-validation.pipe";
import { GraphqlContext } from "@shared/types/graphql.types";
import GraphQLUpload, { FileUpload } from "graphql-upload/GraphQLUpload.mjs";

import { CreateProjectInput } from "./inputs/create-project.input";
import { ProjectFiltersInput } from "./inputs/project-filters.input";
import { UpdateProjectInput } from "./inputs/update-project.input";
import { ProjectModel } from "./project.model";
import { ProjectService } from "./project.service";

@Authorization()
@Resolver("Projects")
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => ProjectModel)
  public async getProjectById(@Args("projectId") projectId: string) {
    return await this.projectService.getById(projectId);
  }
  @Query(() => [ProjectModel])
  public async getAllProjects(
    @Context() { req }: GraphqlContext,
    @Args("filters") filters: ProjectFiltersInput,
  ) {
    return await this.projectService.getAll(req.user.id, filters);
  }
  @Mutation(() => Boolean)
  public async createProject(
    @Context() { req }: GraphqlContext,
    @Args("input") input: CreateProjectInput,
    @Args("file", { type: () => GraphQLUpload }, FileValidationPipe)
    file: FileUpload,
  ) {
    return await this.projectService.create(req.user.id, input, file);
  }
  @Mutation(() => Boolean)
  public async updateProject(
    @Args("projectId") projectId: string,
    @Context() { req }: GraphqlContext,
    @Args("input") input: UpdateProjectInput,
    @Args("file", { type: () => GraphQLUpload }, FileValidationPipe)
    file: FileUpload,
  ) {
    return await this.projectService.update(
      projectId,
      req.user.id,
      input,
      file,
    );
  }
}
