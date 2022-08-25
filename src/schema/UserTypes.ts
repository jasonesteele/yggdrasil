import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  description: "Application user",
  definition(t) {
    t.id("id", { description: "Unique user identifier" });
    t.string("name", { description: "Human readable user name" });
    t.string("image", { description: "URL to avatar image for user " });
    t.dateTime("createdAt", { description: "Timestamp when user was created" });
    t.dateTime("updatedAt", {
      description: "Timestamp when user was last updated",
    });
  },
});
