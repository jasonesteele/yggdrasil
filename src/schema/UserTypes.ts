import { arg, extendType, objectType } from "nexus";
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

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.list.field("userActivity", {
      type: "User",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      description: "Returns any recent user activity",
      args: {
        since: arg({ type: "DateTime" }),
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

// TODO: add mutation to update timestamp and hook into chat input
