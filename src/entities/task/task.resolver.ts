import { Authorization } from "@entities/auth/decorators/authorization.decorator";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphqlContext } from "@shared/types/graphql.types";

import { CreateTaskInput } from "./inputs/create-task.input";
import { TaskFiltersInput } from "./inputs/task-filters.input";
import { UpdateTaskInput } from "./inputs/update-task.input";
import { TaskModel } from "./task.model";
import { TaskService } from "./task.service";

@Authorization()
@Resolver("Tasks")
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => TaskModel)
  public async getTaskById(@Args("taskId") taskId: string) {
    return await this.taskService.getById(taskId);
  }
  @Query(() => [TaskModel])
  public async getAllTasks(
    @Args("projectId") projectId: string,
    @Args("filters") filters: TaskFiltersInput,
  ) {
    return await this.taskService.getAll(projectId, filters);
  }
  @Mutation(() => Boolean)
  public async createTask(
    @Args("projectId") projectId: string,
    @Context() { req }: GraphqlContext,
    @Args("input") input: CreateTaskInput,
  ) {
    return await this.taskService.create(projectId, req.user.id, input);
  }
  @Mutation(() => Boolean)
  public async updateTask(
    @Args("taskId") taskId: string,
    @Context() { req }: GraphqlContext,
    @Args("input") input: UpdateTaskInput,
  ) {
    return await this.taskService.update(taskId, req.user.id, input);
  }
}
