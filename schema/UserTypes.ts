import moment from "moment";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { object, string } from "yup";
import { validateObject, ValidationError } from ".";
import { Context } from "../src/context";
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

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("currentUser", {
      type: User,
      description: "Retrieves the current user",
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: (_root, _args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });
      },
    });

    t.field("user", {
      type: User,
      description: "Retrieves a user by id",
      args: {
        id: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: async (_root, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });

        return { ...user, online: connectedUsers[args.id]?.length > 0 };
      },
    });

    t.list.field("users", {
      type: User,
      description: "Retrieves all users",
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: async (_root, _args, ctx) => {
        const users = await ctx.prisma.user.findMany({
          include: { account: true },
        });
        return users
          .filter((user) => user.account)
          .map((user) => ({
            ...user,
            online: connectedUsers[user.id]?.length > 0,
          }));
      },
    });

    t.list.field("channelUsers", {
      type: User,
      description: "Retrieves users on a channel",
      args: {
        channelId: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: async (_root, args, ctx) => {
        const channel = await ctx.prisma.channel.findUnique({
          where: {
            id: args.channelId,
          },
          include: {
            users: true,
          },
        });

        return (channel?.users || []).map((user) => ({
          ...user,
          online: connectedUsers[user.id]?.length > 0,
        }));
      },
    });
  },
});

export const UserMutateResponse = objectType({
  name: "UserMutateResponse",
  description: "Response to a mutation for updating or creating a user",
  definition(t) {
    t.field("user", { type: User });
    t.list.field("validationErrors", { type: ValidationError });
  },
});

const updateUserSchema = object({
  name: string().strict(true).trim().required().min(3).max(32),
});

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("updateCurrentUser", {
      type: UserMutateResponse,
      args: {
        name: nonNull(stringArg({ description: "Requested user name" })),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      async resolve(_root, args, ctx) {
        const { name } = validateObject(updateUserSchema, args);

        const existingUser = await ctx.prisma.user.findMany({
          where: { name: { equals: args.name, mode: "insensitive" } },
        });
        if (existingUser?.length > 0) {
          return {
            validationErrors: [
              { field: "name", message: "name is not available" },
            ],
          };
        }

        const user = await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: {
            name,
            updatedAt: moment().toDate(),
          },
        });

        ctx.io.emit("user:online", {
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          online: true,
        });

        return { user: { ...user, online: true } };
      },
    });
  },
});
