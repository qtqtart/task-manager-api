import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

import { EnvironmentService } from "~app/environment/environment.service";

@Injectable()
export class RedisService extends Redis {
  constructor(private readonly environmentService: EnvironmentService) {
    super(environmentService.get("REDIS_URL"));
  }
}
