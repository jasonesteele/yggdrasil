import { render, screen } from "@testing-library/react";
import userFixture from "fixtures/userFixture";
import moment from "moment";
import { setWindowWidth } from "../../util/test-utils";
import ChatStatusBar from "./ChatStatusBar";

describe("components", () => {
  describe("ChatStatusBar", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("shows no active users", async () => {
      render(<ChatStatusBar connected={true} activity={[]} />);
      expect(
        await screen.getByTestId("chat-status-activity").innerHTML
      ).toEqual(" ");
      expect(await screen.queryByTestId("chat-status-disconnected")).toBeNull();
      expect(
        await screen.queryByTestId("chat-status-connected")
      ).toBeInTheDocument();
    });

    it("shows one of one active user", async () => {
      render(
        <ChatStatusBar
          connected={true}
          activity={[userFixture({ lastActivity: moment().toDate() }, 0)]}
        />
      );
      expect(
        await screen.getByTestId("chat-status-activity").innerHTML
      ).toContain("User Name 0 is typing...");
    });

    it("shows one of two active uses", async () => {
      render(
        <ChatStatusBar
          connected={true}
          activity={[
            userFixture(
              { lastActivity: moment().subtract(30, "seconds").toDate() },
              0
            ),
            userFixture({ lastActivity: moment().toDate() }, 1),
          ]}
        />
      );
      expect(
        await screen.getByTestId("chat-status-activity").innerHTML
      ).toContain("User Name 1 is typing...");
    });

    it("shows  two active uses", async () => {
      render(
        <ChatStatusBar
          connected={true}
          activity={[
            userFixture({ lastActivity: moment().toDate() }, 0),
            userFixture({ lastActivity: moment().toDate() }, 1),
          ]}
        />
      );
      expect(
        await screen.getByTestId("chat-status-activity").innerHTML
      ).toContain("User Name 0 and User Name 1 are typing...");
    });

    it("shows three active users", async () => {
      render(
        <ChatStatusBar
          connected={true}
          activity={[
            userFixture(
              { lastActivity: moment().subtract(30, "seconds").toDate() },
              0
            ),
            userFixture({ lastActivity: moment().toDate() }, 1),
            userFixture({ lastActivity: moment().toDate() }, 2),
            userFixture({ lastActivity: moment().toDate() }, 3),
          ]}
        />
      );
      expect(
        await screen.getByTestId("chat-status-activity").innerHTML
      ).toContain("User Name 1, User Name 2 and User Name 3 are typing...");
    });

    it("shows more than three active users", async () => {
      render(
        <ChatStatusBar
          connected={true}
          activity={[
            userFixture(
              { lastActivity: moment().subtract(30, "seconds").toDate() },
              0
            ),
            userFixture({ lastActivity: moment().toDate() }, 1),
            userFixture({ lastActivity: moment().toDate() }, 2),
            userFixture({ lastActivity: moment().toDate() }, 3),
            userFixture({ lastActivity: moment().toDate() }, 4),
          ]}
        />
      );
      expect(
        await screen.getByTestId("chat-status-activity").innerHTML
      ).toContain("User Name 1, User Name 2 and two others are typing...");
    });

    it("shows a connection problem", async () => {
      render(<ChatStatusBar connected={false} activity={[]} />);
      expect(
        await screen.queryByTestId("chat-status-disconnected")
      ).toBeInTheDocument();
      expect(await screen.queryByTestId("chat-status-connected")).toBeNull();
    });
  });
});
