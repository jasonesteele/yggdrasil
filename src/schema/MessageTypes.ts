import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "src/util/context";
import { object, string } from "yup";
import { MAX_MESSAGE_LENGTH } from "../util/constants";

export const Message = objectType({
  name: "Message",
  description: "A message sent by a user",
  definition(t) {
    t.id("id", { description: "Unique message identifier" });
    t.field("sequence", {
      description: "Global sequence number",
      type: "BigInt",
    });
    t.field("createdAt", {
      description: "Timestamp of message creation",
      type: "DateTime",
    });
    t.string("text", { description: "Message text" });
    t.field("user", {
      type: "User",
      description: "User who created this message ",
    });
    t.field("channel", {
      type: "Channel",
      description: "Channel this message was sent in",
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.list.field("channelMessages", {
      type: "Message",
      args: {
        channelId: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      description: "Retrieves all active messages on a channel",
      resolve: (_root, args, ctx) => {
        return ctx.prisma.message.findMany({
          where: {
            channelId: args.channelId,
          },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postMessageSchema: any = object({
  text: string().required().min(1).max(MAX_MESSAGE_LENGTH),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatePostMessage = (schema: any, obj: any) => {
  try {
    return schema.validateSync(obj);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error);
  }
};

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("postMessage", {
      type: Message,
      args: {
        channelId: nonNull(stringArg()),
        text: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      async resolve(_root, args, ctx) {
        const { text } = validatePostMessage(postMessageSchema, args);
        return ctx.prisma.message.create({
          data: {
            channel: { connect: { id: args.channelId } },
            text,
            user: { connect: { id: ctx.token.sub } },
          },
        });
      },
    });
  },
});
