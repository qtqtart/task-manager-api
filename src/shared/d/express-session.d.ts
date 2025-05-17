import "express-session";

import { SessionModel } from "@entities/session/session.model";

declare module "express-session" {
  interface SessionData extends SessionModel {}
}
