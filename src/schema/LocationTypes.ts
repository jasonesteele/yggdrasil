import { extendType, nonNull, objectType, stringArg } from "nexus";
import { Context } from "src/util/context";
import { Channel } from "./ChannelTypes";
import { World } from "./WorldTypes";

export const LocationConnection = objectType({
  name: "LocationConnection",
  description: "A connection between two locations",
  definition(t) {
    t.id("name", { description: "Name of the location connector" });
    t.id("description", {
      description: "Short description of the location connector",
    });
    t.field("createdAt", {
      description: "Timestamp when world was created",
      type: "DateTime",
    });
    t.field("updatedAt", {
      description: "Timestamp when world was last updated",
      type: "DateTime",
    });
    t.field("sourceLocation", {
      description: "Source location for this connector",
      type: Location,
    });
    t.field("targetLocation", {
      description: "Target location for this connector",
      type: Location,
    });
  },
});

export const Location = objectType({
  name: "Location",
  description: "A location in a world where role-play can occur",
  definition(t) {
    t.id("id", { description: "Unique identifier for the location" });
    t.id("name", { description: "Name of the location" });
    t.id("description", { description: "Short description of the location" });
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
      description: "World this location is associated with",
    });
    t.field("channel", {
      type: Channel,
      description: "Local channel for this location",
    });
    t.field("exits", {
      type: LocationConnection,
      description: "Exits from this location to other locations",
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.field("location", {
      type: Location,
      description: "Retrieves a location by ID",
      args: {
        id: nonNull(stringArg()),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.location.findUnique({
          where: {
            id: args.id,
          },
          include: {
            characters: true,
            world: true,
            channel: true,
            exits: true,
          },
        });
      },
    });

    t.list.field("locations", {
      type: Location,
      description: "Retrieves a list of locations in a world",
      args: {
        worldId: stringArg(),
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authorize: (_root: any, _args: any, ctx: Context) => !!ctx.token,
      resolve: (_root, args, ctx) => {
        return ctx.prisma.location.findMany({
          where: {
            worldId: args.worldId,
          },
          include: {
            characters: true,
            world: true,
            channel: true,
            exits: true,
          },
        });
      },
    });
  },
});
