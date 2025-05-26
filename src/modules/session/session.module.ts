import { Module } from "@nestjs/common";

import { SessionController } from "./session.contoller";
import { SessionService } from "./session.service";

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
