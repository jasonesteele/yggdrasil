import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "src/util/context";
import { Location } from "./LocationTypes";
import { User } from "./UserTypes";
import { World } from "./WorldTypes";

export const Character = objectType({
  name: "Character",
  description: "A player character",
  definition(t) {
    t.id("id", { description: "Unique identifier for the character" });
    t.string("name", { description: "Character name" });
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
      description: "World this character is associated with",
    });
    t.field("user", {
      type: User,
      description: "User this character belongs to",
    });
    t.field("location", {
      type: Location,
      description: "Current location of the character",
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("character", {
      type: Character,
      description: "Retrieves a character by ID",
      args: {
        id: nonNull(stringArg()),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.character.findUnique({
          where: {
            id: args.id,
          },
          include: {
            world: true,
            user: true,
            location: true,
          },
        });
      },
    });

    t.list.field("charactersInWorld", {
      type: Character,
      description: "Retrieves a list of characters in a world",
      args: {
        worldId: nonNull(stringArg()),
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.character.findMany({
          where: {
            worldId: args.worldId,
          },
          include: {
            world: true,
            user: true,
            location: true,
          },
        });
      },
    });

    t.list.field("charactersInLocation", {
      type: Character,
      description: "Retrieves a list of characters in a location",
      args: {
        locationId: stringArg(),
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.character.findMany({
          where: {
            locationId: args.locationId,
          },
          include: {
            world: true,
            user: true,
            location: true,
          },
        });
      },
    });
  },
});
