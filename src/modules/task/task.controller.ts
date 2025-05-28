import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from "@nestjs/common";
import { TaskPriority, TaskState } from "@prisma/client";
import { Request } from "express";

import { TaskService } from "./task.service";

@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(":id")
  public async getById(
    @Param("id", ParseUUIDPipe) taskId: string,
    @Req() req: Request,
  ) {
    return await this.taskService.getById(taskId, req.user.id);
  }

  @Get()
  public async getAll(
    @Req() req: Request,
    @Query("projectId", ParseUUIDPipe) projectId: string = "",
    @Query("searchTerms") searchTerms?: string,
    @Query("isArchived") isArchived?: boolean,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("state") state?: TaskState,
    @Query("priority") priority?: TaskPriority,
    @Query("assigneeId") assigneeId?: string,
  ) {
    return await this.taskService.getAll(
      projectId,
      {
        searchTerms,
        isArchived,
        startDate,
        endDate,
        state,
        priority,
        assigneeId,
      },
      req.user.id,
    );
  }
}
