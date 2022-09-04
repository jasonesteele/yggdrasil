import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { setWindowWidth } from "../../util/test-utils";
import ChatPanel, { GET_GLOBAL_CHANNEL } from "./ChatPanel";

const successResponse = {
  request: {
    query: GET_GLOBAL_CHANNEL,
  },
  result: {
    data: {
      globalChannel: {
        id: "global-channel-1",
        name: "The Global Channel",
      },
    },
  },
};

const errorResponse = {
  request: {
    query: GET_GLOBAL_CHANNEL,
  },
  error: new Error("An error occurred!"),
};

describe("components", () => {
  describe("ChatPanel", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders global channel", async () => {
      render(
        <MockedProvider mocks={[successResponse]}>
          <ChatPanel />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Loading global chat")
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText("The Global Channel")).toBeInTheDocument();
      expect(screen.getByTestId("chat-history")).toBeInTheDocument();
      expect(screen.getByTestId("user-list")).toBeInTheDocument();
      expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
      expect(
        screen.getByTestId("chat-status-disconnected")
      ).toBeInTheDocument();
    });

    it("display an error", async () => {
      render(
        <MockedProvider mocks={[errorResponse]}>
          <ChatPanel />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByText("Loading global chat")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByText("An error occurred!")).toBeInTheDocument();
    });
  });
});
