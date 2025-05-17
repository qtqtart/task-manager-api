import { UserModel } from "@entities/user/user.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { TaskFile } from "@prisma/client";

@ObjectType()
export class TaskFileModel implements Partial<TaskFile> {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  taskId: string;
  @Field(() => String)
  fileName: string;
  @Field(() => String)
  fileType: string;
  @Field(() => Number)
  size: number;
  @Field(() => String)
  url: string;
  @Field(() => UserModel)
  user: UserModel;
}
