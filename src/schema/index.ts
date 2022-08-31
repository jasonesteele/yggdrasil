import { BigIntResolver, GraphQLDateTime } from "graphql-scalars";
import { asNexusMethod, fieldAuthorizePlugin, makeSchema } from "nexus";
import path from "path";
import * as ArticleTypes from "./ArticleTypes";
import * as ChannelTypes from "./ChannelTypes";
import * as CharacterTypes from "./CharacterTypes";
import * as LocationTypes from "./LocationTypes";
import * as MessageTypes from "./MessageTypes";
import * as UserTypes from "./UserTypes";
import * as WorldTypes from "./WorldTypes";

export const GQLDateTime = asNexusMethod(GraphQLDateTime, "dateTime");

const schema = makeSchema({
  types: [
    GQLDateTime,
    BigIntResolver,
    UserTypes,
    MessageTypes,
    ChannelTypes,
    CharacterTypes,
    WorldTypes,
    LocationTypes,
    ArticleTypes,
  ],
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
