import { arg, booleanArg, extendType, objectType } from "nexus";
import { Context } from "src/pages/api/context";
import moment from "moment";

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
    t.field("lastActivity", {
      description: "Timestamp of last user activity",
      type: "DateTime",
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
    t.list.field("userActivity", {
      type: "User",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      description: "Returns any recent user activity",
      args: {
        since: arg({
          type: "DateTime",
          description: "Check for activity since this time",
        }),
      },
      resolve: (_root, args, ctx) => {
        return ctx.prisma.user.findMany({
          where: {
            lastActivity: {
              gte: args.since || moment().subtract({ seconds: 10 }).toDate(),
            },
          },
          orderBy: [
            {
              lastActivity: "desc",
            },
          ],
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      description: "Notifies the server of user activity in a chat window",
      args: {
        active: booleanArg({ description: "True if user is active" }),
      },
      async resolve(_root, args, ctx) {
        await ctx.prisma.user.update({
          where: {
            id: ctx.token.sub,
          },
          data: {
            lastActivity: args.active ? moment().toDate() : null,
          },
        });
        return { success: true };
      },
    });
  },
});
