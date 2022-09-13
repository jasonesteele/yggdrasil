import { extendType, objectType } from "nexus";
import { Context } from "../src/context";
import { Location } from "./LocationTypes";
import { Message } from "./MessageTypes";
import { User } from "./UserTypes";
import { World } from "./WorldTypes";

export const Channel = objectType({
  name: "Channel",
  description: "A message channel",
  definition(t) {
    t.id("id", { description: "Unique channel identifier" });
    t.string("name", { description: "Name of the channel" });
    t.list.field("users", {
      description: "Users subscribed to the channel",
      type: User,
    });
    t.list.field("messages", {
      description: "Messages in the channell",
      type: Message,
    });
    t.field("createdAt", {
      description: "Timestamp of channel creation",
      type: "DateTime",
    });
    t.field("updatedAt", {
      description: "Timestamp of last modification of channel",
      type: "DateTime",
    });
    t.field("world", {
      description: "World this channel is associated with",
      type: World,
    });
    t.field("location", {
      description: "Location this channel is associated with",
      type: Location,
    });
  },
});

export const Query = extendType({
  type: "Query",
  definition(t) {
    t.list.field("subscribedChannels", {
      type: Channel,
      description: "Retrieves the current user's subscribed channels",
      authorize: (_root, _args, ctx: Context) => !!ctx.user,
      resolve: async (_root, _args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
          include: {
            channels: true,
          },
        });
        return user?.channels || [];
      },
    });
  },
});
