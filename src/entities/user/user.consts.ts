import { UserModel } from "./user.model";

export const USER_SELECT: {
  [K in keyof Partial<UserModel>]: true;
} = {
  id: true,
  username: true,
  email: true,
  imageUrl: true,
  firstName: true,
  lastName: true,
} as const;
