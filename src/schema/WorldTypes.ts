import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "src/util/context";
import { Article } from "./ArticleTypes";
import { Channel } from "./ChannelTypes";
import { Character } from "./CharacterTypes";
import { Location } from "./LocationTypes";
import { User } from "./UserTypes";

export const World = objectType({
  name: "World",
  description: "A role-play setting",
  definition(t) {
    t.id("id", { description: "Unique identifier for world" });
    t.string("name", { description: "Name of the world" });
    t.string("description", { description: "Description of the world" });
    t.string("image", { description: "URL for world thumbnail image" });
    t.field("createdAt", {
      description: "Timestamp when world was created",
      type: "DateTime",
    });
    t.field("updatedAt", {
      description: "Timestamp when world was last updated",
      type: "DateTime",
    });
    t.field("owner", {
      description: "User that owns this world",
      type: User,
    });
    t.list.field("articles", {
      type: Article,
      description: "Articles relating to this world",
    });
    t.list.field("characters", {
      type: Character,
      description: "Characters currently in this world",
    });
    t.list.field("users", {
      type: User,
      description: "Users associated with this world",
    });
    t.list.field("locations", {
      type: Location,
      description: "Locations defined in this world",
    });
    t.field("channel", {
      type: Channel,
      description: "Global channel for this world",
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("world", {
      type: World,
      description: "Retrieves a world by ID",
      args: {
        id: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.world.findUnique({
          where: {
            id: args.id,
          },
          include: {
            owner: true,
            articles: true,
            characters: true,
            users: true,
            locations: true,
            channel: true,
          },
        });
      },
    });

    t.list.field("worlds", {
      type: World,
      description: "Retrieves a list of worlds from the server",
      authorize: (_root, _args, ctx: Context) => !!ctx.token,
      resolve: (_root, _args, ctx) => {
        return ctx.prisma.world.findMany({
          include: {
            owner: true,
            articles: true,
            characters: true,
            users: true,
            locations: true,
            channel: true,
          },
        });
      },
    });
  },
});
