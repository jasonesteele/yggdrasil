import { objectType } from "nexus";
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
