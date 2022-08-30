import { UserInputError } from "apollo-server-micro";
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
    t.list.field("messages", {
      type: "Message",
      args: {
        channel: nonNull(stringArg()),
        sinceSequence: stringArg(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      description: "Retrieves all active messages on a channel",
      resolve: (_root, args, ctx) => {
        return ctx.prisma.message.findMany({
          where: {
            channelId: args.channel,
            sequence: {
              gte: BigInt(args.sinceSequence) || 0,
            },
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
        channel: nonNull(stringArg()),
        text: nonNull(stringArg()),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      async resolve(_root, args, ctx) {
        const { text } = validatePostMessage(postMessageSchema, args);
        return ctx.prisma.message.create({
          data: {
            channel: { connect: { id: args.channel } },
            text,
            user: { connect: { id: ctx.token.sub } },
          },
        });
      },
    });
  },
});
