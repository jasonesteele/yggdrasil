import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "src/util/context";
import { User } from "./UserTypes";
import { World } from "./WorldTypes";

export const Article = objectType({
  name: "Article",
  description: "An article of content",
  definition(t) {
    t.id("id", { description: "Unique identifier for the article" });
    t.string("title", { description: "Title of the article" });
    t.string("text", { description: "Contents of the article" });
    t.field("createdAt", {
      description: "Timestamp when world was created",
      type: "DateTime",
    });
    t.field("updatedAt", {
      description: "Timestamp when world was last updated",
      type: "DateTime",
    });
    t.field("world", {
      type: World,
      description: "Optional world that this article is associated with",
    });
    t.field("createdBy", {
      description: "User that created this article",
      type: User,
    });
    t.field("updatedBy", {
      description: "User that last updated this article",
      type: User,
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("article", {
      type: Article,
      description: "Retrieves an article by ID",
      args: {
        id: nonNull(stringArg()),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.article.findUnique({
          where: {
            id: args.id,
          },
          include: {
            world: true,
            createdByUser: true,
            updatedByUser: true,
          },
        });
      },
    });

    t.list.field("articles", {
      type: Article,
      description: "Retrieves a list of articles from the server",
      args: {
        worldId: stringArg(),
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.article.findMany({
          where: {
            worldId: args.worldId,
          },
          include: {
            world: true,
            createdByUser: true,
            updatedByUser: true,
          },
        });
      },
    });
  },
});
