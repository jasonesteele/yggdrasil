import { extendType, nonNull, objectType, stringArg } from "nexus";
import { MAX_MESSAGE_LENGTH } from "../util/constants";
import { object, string } from "yup";
import { UserInputError } from "apollo-server-micro";
import { Context } from "src/util/context";

export const MAX_QUERY_MESSAGES = 1000;

export const Message = objectType({
  name: "Message",
  description: "A message sent by a user",
  definition(t) {
    t.id("id", { description: "Unique message identifier" });
    t.field("createdAt", {
      description: "Timestamp of message creation",
      type: "DateTime",
    });
    t.string("text", { description: "Message text" });
    t.field("user", {
      type: "User",
      description: "User who created this message ",
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.list.field("messages", {
      type: "Message",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      description: "Retrieves all active messages on the server",
      resolve: (_root, _args, ctx) => {
        return ctx.prisma.message.findMany({
          take: MAX_QUERY_MESSAGES,
          include: {
            user: true,
          },
          orderBy: [
            {
              createdAt: "asc",
            },
          ],
        });
      },
    });
  },
});

const postMessageSchema = object({
  text: string().required().min(1).max(MAX_MESSAGE_LENGTH),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePostMessage = (schema: any, obj: any) => {
  try {
    return schema.validateSync(obj);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new UserInputError(error);
  }
};

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("postMessage", {
      type: Message,
      args: {
        text: nonNull(stringArg()),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      async resolve(_root, args, ctx) {
        const { text } = validatePostMessage(postMessageSchema, args);
        return ctx.prisma.message.create({
          data: {
            text,
            user: { connect: { id: ctx.token.sub } },
          },
        });
      },
    });
  },
});
