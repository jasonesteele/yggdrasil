import { asNexusMethod, fieldAuthorizePlugin, makeSchema } from "nexus";
import * as UserTypes from "./UserTypes";
import * as MessageTypes from "./MessageTypes";
import path from "path";
import { GraphQLDateTime } from "graphql-scalars";

export const GQLDateTime = asNexusMethod(GraphQLDateTime, "dateTime");

const schema = makeSchema({
  types: [GQLDateTime, MessageTypes, UserTypes],
  shouldGenerateArtifacts:
    !process.env.NODE_ENV || process.env.NODE_ENV === "development",
  plugins: [fieldAuthorizePlugin()],
  outputs: {
    typegen: path.join(process.cwd(), "src/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "src/schema.graphql"),
  },
  contextType: {
    module: path.join(process.cwd(), "src/util/context.ts"),
    export: "Context",
  },
});

export default schema;
