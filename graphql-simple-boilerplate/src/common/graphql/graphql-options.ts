import { GqlModuleOptions } from '@nestjs/graphql';
import { join } from 'path';

export function graphqlOptions(): GqlModuleOptions {
  return {
    debug: true,
    playground: true,
    autoSchemaFile: join(process.cwd(), 'src/common/schema-graphql/schema.gql'),
    sortSchema: true,
    introspection: true,
    cors: true,
  };
}
