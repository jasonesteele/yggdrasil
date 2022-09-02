import { render, screen } from "@testing-library/react";
import userFixture from "../../../fixtures/userFixture";
import { setWindowWidth } from "../../util/test-utils";
import ChatUsers from "./ChatUsers";

describe("components", () => {
  describe("ChatUsers", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders a list of users", async () => {
      render(
        <ChatUsers users={[userFixture(null, 1), userFixture(null, 2)]} />
      );

      const user0 = await screen.findByTestId("user-name-0");
      expect(user0).toBeInTheDocument();
      expect(user0.innerHTML).toEqual("User Name 1");
      expect(await screen.findByTestId("user-avatar-0")).toBeInTheDocument();
      const user1 = await screen.findByTestId("user-name-1");
      expect(user1).toBeInTheDocument();
      expect(user1.innerHTML).toEqual("User Name 2");
      expect(await screen.findByTestId("user-avatar-1")).toBeInTheDocument();
    });

    it("renders a list of users (small screen)", async () => {
      setWindowWidth(600);
      render(
        <ChatUsers users={[userFixture(null, 1), userFixture(null, 2)]} />
      );

      expect(screen.queryByText("User Name 1")).toBeNull();
      expect(await screen.findByTestId("user-avatar-0")).toBeInTheDocument();
      expect(screen.queryByText("User Name 2")).toBeNull();
      expect(await screen.findByTestId("user-avatar-1")).toBeInTheDocument();
    });
  });
});
