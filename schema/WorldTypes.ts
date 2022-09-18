import { extendType, nonNull, objectType, stringArg } from "nexus";
import { object, string } from "yup";
import { validateObject } from ".";
import { Context } from "../src/context";
import { Article } from "./ArticleTypes";
import { Channel } from "./ChannelTypes";
import { Character } from "./CharacterTypes";
import { Location } from "./LocationTypes";
import { OperationResponse, User } from "./UserTypes";

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
    t.list.field("worlds", {
      type: World,
      description: "Retrieves all worlds visible to the current user",
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: async (_root, _args, ctx) =>
        ctx.prisma.world.findMany({ include: { owner: true } }),
    });

    t.field("worldNameAvailability", {
      type: OperationResponse,
      description: "Determines if a world names is available",
      args: {
        name: nonNull(stringArg()),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: async (_root, args, ctx) => {
        const world = await ctx.prisma.world.findMany({
          where: { name: { equals: args.name, mode: "insensitive" } },
        });
        // TODO: other validation on world name (profanity filter, etc.)
        return { success: !world?.length };
      },
    });
  },
});

const createWorldSchema = object({
  name: string().strict(true).trim().required().min(5).max(32),
  description: string()
    .strict(true)
    .trim()
    .matches(/.{10,}/, {
      excludeEmptyString: true,
      message: "description must be at least 10 characters",
    })
    .max(255),
});

export const Mutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("createWorld", {
      type: World,
      args: {
        name: nonNull(stringArg({ description: "Unique world name" })),
        description: stringArg({
          description: "Short description of the world",
        }),
      },
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      async resolve(_root, args, ctx) {
        const { name, description } = validateObject(createWorldSchema, args);

        const existingWorld = await ctx.prisma.world.findMany({
          where: { name: { equals: args.name, mode: "insensitive" } },
        });
        console.log(existingWorld);
        if (existingWorld?.length > 0) throw new Error("name not available");

        const worldChannel = await ctx.prisma.channel.create({
          data: { name: "World" },
        });

        const world = await ctx.prisma.world.create({
          data: {
            name,
            description,
            channel: { connect: { id: worldChannel.id } },
            owner: { connect: { id: ctx.user.id } },
          },
          include: {
            owner: true,
          },
        });
        ctx.io.emit(`world:create`, world);
        return world;
      },
    });
  },
});
