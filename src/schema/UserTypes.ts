import {
  extendType,
  nonNull,
  objectType,
  stringArg,
  subscriptionField,
} from "nexus";
import { NexusGenRootTypes } from "src/nexus-typegen";
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
    t.field("online", {
      description: "True if user is currently online",
      type: "Boolean",
    });
  },
});

export const UserActivity = objectType({
  name: "UserActivity",
  description: "A notification of user activity in a channel",
  definition(t) {
    t.field("user", { type: User, description: "User who performed activity" });
    t.field("channel", {
      type: Channel,
      description: "Channel activity was performed in",
    });
    t.field("timestamp", {
      type: "DateTime",
      description: "Time stamp of activity",
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
          },
        });
      },
    });

    t.list.field("channelUsers", {
      type: User,
      description: "Retrieves users on a channel",
      args: {
        channelId: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      resolve: async (_root, args, ctx) => {
        const channel = await ctx.prisma.channel.findUnique({
          where: {
            id: args.channelId,
          },
          include: {
            users: true,
          },
        });

        return channel?.users || [];
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
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.token.sub,
          },
        });
        const channel = args.channelId
          ? await ctx.prisma.channel.findUnique({
              where: {
                id: args.channelId,
              },
              include: {
                users: true,
              },
            })
          : null;

        ctx.pubSub.publish("message:userActivity", {
          user,
          channel,
          timestamp: new Date(),
        });

        return { success: true };
      },
    });
  },
});

export const UserActivitySubscription = subscriptionField("userActivity", {
  type: UserActivity,
  authorize: (_root, _args, ctx: Context) => !!ctx.token,
  subscribe: (_root, _args, ctx) =>
    ctx.pubSub.subscribe("message:userActivity"),
  resolve: (payload: Promise<NexusGenRootTypes["UserActivity"]>) => payload,
});
