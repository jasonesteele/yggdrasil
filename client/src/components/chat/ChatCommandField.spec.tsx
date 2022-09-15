import { setWindowWidth } from "../../util/test-utils";

describe("components", () => {
  describe("ChatCommandField", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it.todo("sends a chat message on the channel");
    it.todo("sends activity notification when typing");
    it.todo("clears activity notification when input cleared");
    it.todo("shows error indicator when message fails to post");
  });
});
