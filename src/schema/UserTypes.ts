import moment from "moment";
import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { DEFAULT_MAX_AGE_SECONDS } from "../util/constants";
import { Context } from "src/util/context";
import { Article } from "./ArticleTypes";
import { Channel } from "./ChannelTypes";
import { Character } from "./CharacterTypes";
import { World } from "./WorldTypes";

export const User = objectType({
  name: "User",
  description: "Application user",
  definition(t) {
    t.id("id", { description: "Unique user identifier" });
    t.string("name", { description: "Human readable user name" });
    t.string("image", { description: "URL to avatar image for user " });
    t.field("createdAt", {
      description: "Timestamp when user was created",
      type: "DateTime",
    });
    t.field("updatedAt", {
      description: "Timestamp when user was last updated",
      type: "DateTime",
    });
    t.list.field("worlds", {
      description: "Worlds that belong to this user",
      type: World,
    });
    t.list.field("characters", {
      description: "Characters that belong to this user",
      type: Character,
    });
    t.list.field("channels", {
      description: "Channels this user is a member of",
      type: Channel,
    });
    t.list.field("createdArticles", {
      description: "Articles this user has created",
      type: Article,
    });
    t.field("lastActivity", {
      description: "Timestamp of last user activity",
      type: "DateTime",
    });
    t.field("activeChannel", {
      description: "Message channel user is currently active in",
      type: Channel,
    });
    t.field("online", {
      description: "True if user is currently online",
      type: "Boolean",
    });
  },
});

export const OperationResponse = objectType({
  name: "OperationResponse",
  description: "Generic response to an API operation",
  definition(t) {
    t.boolean("success", { description: "Was the operation successful" });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: User,
      description: "Retrieves a user by ID",
      args: {
        id: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            id: args.id,
          },
          include: {
            createdArticles: true,
            characters: true,
            channels: true,
            messages: true,
            activeChannel: true,
          },
        });
      },
    });

    t.list.field("users", {
      type: User,
      description: "Retrieves users on the server",
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      resolve: (_root, _args, ctx) => {
        return ctx.prisma.user.findMany({
          include: {
            createdArticles: true,
            characters: true,
            channels: true,
            messages: true,
            activeChannel: true,
          },
        });
      },
    });

    t.list.field("channelActivity", {
      type: User,
      description: "Retrieves active users on a channel",
      args: {
        channelId: nonNull(stringArg({ description: "Channel identifier" })),
        maxAgeSeconds: intArg({
          description: "Maximum period for recent activity (in seconds)",
        }),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.user.findMany({
          where: {
            activeChannelId: args.channelId,
            lastActivity: {
              gte: moment()
                .subtract(
                  args.maxAgeSeconds || DEFAULT_MAX_AGE_SECONDS,
                  "seconds"
                )
                .toDate(),
            },
          },
        });
      },
    });
  },
});

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("notifyActivity", {
      type: OperationResponse,
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      description: "Notifies the server of user activity in a chat window",
      args: {
        channelId: stringArg({
          description: "ID of channel user is active in",
        }),
      },
      async resolve(_root, args, ctx) {
        await ctx.prisma.user.update({
          where: {
            id: ctx.token.sub,
          },
          data: {
            activeChannel: args.channelId
              ? { connect: { id: args.channelId } }
              : { disconnect: true },
            lastActivity: args.channelId ? moment().toDate() : null,
          },
        });
        return { success: true };
      },
    });
  },
});
