import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import SessionProvider from "../../providers/SessionProvider";
import { setWindowWidth } from "../../util/test-utils";
import ChatChannel from "./ChatChannel";

jest.mock("../../hooks/useWebSocket");
jest.mock("../../hooks/useInterval");

const mocks: any[] = [];

describe("components", () => {
  describe("ChatChannel", () => {
    beforeEach(() => {
      setWindowWidth(1024);
    });

    it("renders the component", async () => {
      render(
        <MockedProvider mocks={mocks}>
          <SessionProvider>
            <ChatChannel channelId="test-id" />
          </SessionProvider>
        </MockedProvider>
      );

      expect(screen.getByTestId("chat-channel-test-id")).toBeInTheDocument();
      expect(screen.getByTestId("chat-history")).toBeInTheDocument();
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
      expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-activity")).toBeInTheDocument();
    });
  });
});
