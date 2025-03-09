import { UserService } from '@modules/user/user.service';

import { Module } from '@nestjs/common';

import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  controllers: [MeController],
  providers: [MeService, UserService],
})
export class MeModule {}
