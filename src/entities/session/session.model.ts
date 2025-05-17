import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SessionModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  userId: string;

  @Field(() => Date)
  createdAt: Date;
}
