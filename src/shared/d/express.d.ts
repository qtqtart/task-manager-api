import { User as _User } from '@prisma/client';

declare global {
  namespace Express {
    interface User extends Pick<_User, 'id'> {}
  }
}
