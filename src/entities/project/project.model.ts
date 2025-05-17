import { UserModel } from "@entities/user/user.model";
import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Project } from "@prisma/client";

@ObjectType()
export class ProjectModel implements Partial<Project> {
  @Field(() => ID)
  id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => String)
  title: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => String, { nullable: true })
  imageUrl?: string;
  @Field(() => Boolean)
  isArchived: boolean;
  @Field(() => [UserModel])
  members: UserModel[];
  @Field(() => UserModel)
  user: UserModel;
}
