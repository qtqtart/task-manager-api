import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentModel } from './environment.model';

@Injectable()
export class EnvironmentService {
  public constructor(private readonly configService: ConfigService) {}

  public get<T extends keyof EnvironmentModel>(key: T) {
    return this.configService.get(key, new EnvironmentModel()[key]);
  }
}
