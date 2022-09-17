import { act, render, screen, waitFor } from "@testing-library/react";
import moment from "moment";
import userFixture from "../../fixtures/userFixture";
import { setWindowWidth } from "../../util/test-utils";
import ChatStatusBar from "./ChatStatusBar";

jest.mock("../../hooks/useWebSocket");
jest.mock("../../hooks/useInterval");

describe("components", () => {
  describe("ChatStatusBar", () => {
    beforeEach(() => {
      setWindowWidth(1024);
      global.__useWebSocket_isConnected = true;
    });

    it("shows no active users", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      await waitFor(() => {
        expect(screen.getByTestId("chat-status-connected")).toBeInTheDocument();
      });
    });

    it("shows one active user", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 0),
            timestamp: moment().toDate(),
          });
        }
      });

      await waitFor(() => {
        expect(
          screen.getByText("User Name 0 is typing...")
        ).toBeInTheDocument();
      });
    });

    it("shows two active users", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 0),
            timestamp: moment().toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 1),
            timestamp: moment().toDate(),
          });
        }
      });

      await waitFor(() => {
        expect(
          screen.getByText("User Name 0 and User Name 1 are typing...")
        ).toBeInTheDocument();
      });
    });

    it("ignores activity not on the current channel", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 0),
            timestamp: moment().toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "other-channel",
            active: true,
            user: userFixture({ online: true }, 1),
            timestamp: moment().toDate(),
          });
        }
      });

      await waitFor(() => {
        expect(
          screen.getByText("User Name 0 is typing...")
        ).toBeInTheDocument();
      });
    });

    it("properly handles an inactive notification", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 0),
            timestamp: moment().toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 1),
            timestamp: moment().toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: false,
            user: userFixture({ online: true }, 0),
            timestamp: moment().toDate(),
          });
        }
      });

      await waitFor(() => {
        expect(
          screen.getByText("User Name 1 is typing...")
        ).toBeInTheDocument();
      });
    });

    it("properly times out a notification", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 0),
            timestamp: moment().subtract(1, "minutes").toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 1),
            timestamp: moment().toDate(),
          });
        }
      });
      act(() => {
        __useInterval_callback();
      });

      await waitFor(() => {
        expect(
          screen.getByText("User Name 1 is typing...")
        ).toBeInTheDocument();
      });
    });

    it("shows three active users", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 0),
            timestamp: moment().toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 1),
            timestamp: moment().toDate(),
          });
          __useWebSocket_onEvent({
            channelId: "test-channel",
            active: true,
            user: userFixture({ online: true }, 2),
            timestamp: moment().toDate(),
          });
        }
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "User Name 0, User Name 1 and User Name 2 are typing..."
          )
        ).toBeInTheDocument();
      });
    });

    it("shows more than three active users", async () => {
      render(<ChatStatusBar channelId="test-channel" />);

      act(() => {
        if (__useWebSocket_onEvent) {
          for (let i = 0; i < 10; i++) {
            __useWebSocket_onEvent({
              channelId: "test-channel",
              active: true,
              user: userFixture({ online: true }, i),
              timestamp: moment().toDate(),
            });
          }
        }
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            "User Name 0, User Name 1 and eight others are typing..."
          )
        ).toBeInTheDocument();
      });
    });

    it("shows a connection problem", async () => {
      global.__useWebSocket_isConnected = false;

      render(<ChatStatusBar channelId="test-channel" />);

      await waitFor(() => {
        expect(
          screen.getByTestId("chat-status-disconnected")
        ).toBeInTheDocument();
      });
    });
  });
});
