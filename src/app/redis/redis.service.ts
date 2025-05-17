import { EnvironmentService } from "@app/environment/environment.service";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService extends Redis {
  constructor(private readonly environmentService: EnvironmentService) {
    super(environmentService.get("REDIS_URL"));
  }
}
