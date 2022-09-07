import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { setWindowWidth } from "../../util/test-utils";
import ChatChannel from "./ChatChannel";

describe("components", () => {
  describe("ChatChannel", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders a channel", async () => {
      render(
        <MockedProvider mocks={[]}>
          <ChatChannel channelId="test-channel-id" />
        </MockedProvider>
      );

      expect(screen.getByTestId("chat-history")).toBeInTheDocument();
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
      expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-connected")).toBeInTheDocument();
    });
  });
});
