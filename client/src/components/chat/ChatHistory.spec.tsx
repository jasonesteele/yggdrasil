import { setWindowWidth } from "../../util/test-utils";

describe("components", () => {
  describe("ChatHistory", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it.todo("renders an empty channel");
    it.todo("renders a channel with some messages");
    it.todo("dyanmically adds a new message");
    it.todo("rolls off old messages");
    it.todo("displays an error");
  });
});
