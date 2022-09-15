import { setWindowWidth } from "../../util/test-utils";

describe("components", () => {
  describe("ChatPanel", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it.todo("renders the chat panel with no channels");
    it.todo("renders the chat panel with one channel");
    it.todo("renders the chat panel with many channels");
    it.todo("handles an error");
  });
});
