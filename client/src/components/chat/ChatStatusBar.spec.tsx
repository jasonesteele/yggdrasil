import { setWindowWidth } from "../../util/test-utils";

describe("components", () => {
  describe("ChatStatusBar", () => {
    beforeEach(() => {
      setWindowWidth(1024);
    });

    it.todo("shows no active users");
    it.todo("shows one of one active user");
    it.todo("shows one of two active users");

    it.todo("shows two active users");
    it.todo("shows three active users");
    it.todo("shows more than three active users");
    it.todo("shows a connection problem");
  });
});
