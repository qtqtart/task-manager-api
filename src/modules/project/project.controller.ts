import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { Request } from "express";

import { Auth } from "~modules/auth/decorators/auth.decorator";

import { CreateProjectDto } from "./dtos/create-project.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { ProjectService } from "./project.service";

@Auth()
@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get(":id")
  public async getById(
    @Param("id", ParseUUIDPipe) projectId: string,
    @Req() req: Request,
  ) {
    return await this.projectService.checkOwnership(projectId, req.user.id);
  }

  @Get()
  public async getAll(
    @Query("searchTerms") searchTerms: string = "",
    @Query("isArchived", ParseBoolPipe) isArchived: boolean = false,
    @Req() req: Request,
  ) {
    return await this.projectService.getAll(
      searchTerms,
      isArchived,
      req.user.id,
    );
  }

  @Post()
  public async create(@Body() dto: CreateProjectDto, @Req() req: Request) {
    return await this.projectService.create(dto, req.user.id);
  }

  @Patch(":id")
  public async update(
    @Param("id", ParseUUIDPipe) projectId: string,
    @Body() dto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    return await this.projectService.update(projectId, dto, req.user.id);
  }
}
