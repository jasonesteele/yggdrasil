import { objectType } from "nexus";
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
