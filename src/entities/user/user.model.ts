import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Field(() => String)
  username: string;
  @Field(() => String)
  email: string;
  @Field(() => String, { nullable: true })
  firstName: string;
  @Field(() => String, { nullable: true })
  lastName: string;
  @Field(() => String, { nullable: true })
  imageUrl: string;
}
