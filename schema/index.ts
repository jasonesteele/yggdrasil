import { BigIntResolver, GraphQLDateTime } from "graphql-scalars";
import {
  asNexusMethod,
  fieldAuthorizePlugin,
  makeSchema,
  objectType,
} from "nexus";
import path from "path";
import * as ArticleTypes from "./ArticleTypes";
import * as ChannelTypes from "./ChannelTypes";
import * as CharacterTypes from "./CharacterTypes";
import * as LocationTypes from "./LocationTypes";
import * as MessageTypes from "./MessageTypes";
import * as UserTypes from "./UserTypes";
import * as WorldTypes from "./WorldTypes";

export const GQLDateTime = asNexusMethod(GraphQLDateTime, "dateTime");

export const ValidationError = objectType({
  name: "ValidationError",
  description: "Validation error for a mutation",
  definition(t) {
    t.string("field", { description: "Name of field with error" });
    t.string("message", { description: "Error message" });
  },
});

export const OperationResponse = objectType({
  name: "OperationResponse",
  description: "Generic response to an API operation",
  definition(t) {
    t.boolean("success", { description: "Was the operation successful" });
  },
});

export const validateObject = (schema: any, obj: any) => {
  try {
    return schema.validateSync(obj);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

const schema = makeSchema({
  types: [
    GQLDateTime,
    BigIntResolver,
    ValidationError,
    OperationResponse,
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
    module: path.join(process.cwd(), "src/context/index.ts"),
    export: "Context",
  },
});

export default schema;
