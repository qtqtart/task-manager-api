import { UserModel } from "@entities/user/user.model";
import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Task, TaskPriority, TaskState } from "@prisma/client";

registerEnumType(TaskState, { name: "TaskState" });
registerEnumType(TaskPriority, { name: "TaskPriority" });

@ObjectType()
export class TaskModel implements Partial<Task> {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  projectId: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => String)
  title: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => TaskState)
  state: TaskState;
  @Field(() => TaskPriority)
  priority: TaskPriority;
  @Field(() => Date)
  startDate: Date;
  @Field(() => Date)
  endDate: Date;
  @Field(() => Boolean)
  isArchived: boolean;
  @Field(() => [UserModel])
  assignees: UserModel[];
  @Field(() => UserModel)
  user: UserModel;
}
