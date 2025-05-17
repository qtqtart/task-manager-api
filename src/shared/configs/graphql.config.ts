import { EnvironmentService } from "@app/environment/environment.service";
import { ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";

export const getGraphQLConfig = (
  environmentService: EnvironmentService,
): ApolloDriverConfig => ({
  path: environmentService.get("GRAPHQL_PREFIX"),
  autoSchemaFile: join(process.cwd(), "src/shared/schema.gql"),
  context: ({ req, res }) => ({ req, res }),
  playground: true,
  installSubscriptionHandlers: true,
  introspection: true,
  sortSchema: true,
});
