import { objectType } from "nexus";
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
