import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import moment from "moment";
import { setWindowWidth } from "../../util/test-utils";
import ChatHistory, { GET_CHANNEL_MESSAGES } from "./ChatHistory";

const noMessages = {
  request: {
    query: GET_CHANNEL_MESSAGES,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelMessages: [],
    },
  },
};

const someMessages = {
  request: {
    query: GET_CHANNEL_MESSAGES,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelMessages: [
        {
          user: { id: "user-1", name: "User1", image: null },
          sequence: 0,
          text: "Message number one",
          createdAt: moment("2020-01-01T12:34:56").toDate(),
        },
        {
          user: { id: "user-2", name: "User2", image: null },
          sequence: 1,
          text: "Message number two",
          createdAt: moment("2020-01-01T12:36:14").toDate(),
        },
      ],
    },
  },
};

const errorResponse = {
  request: {
    query: GET_CHANNEL_MESSAGES,
    variables: {
      channelId: "test-channel-id",
    },
  },
  error: new Error("An error occurred!"),
};

describe("components", () => {
  describe("ChatHistory", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders an empty channel", async () => {
      render(
        <MockedProvider mocks={[noMessages]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument()
      );
      expect(screen.getByTestId("chat-history")).toBeInTheDocument();
    });

    it("renders a channel with some messages", async () => {
      render(
        <MockedProvider mocks={[someMessages]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument()
      );
      expect(screen.getByText("User1")).toBeInTheDocument();
      expect(screen.getByText("12:34 PM")).toBeInTheDocument();
      expect(screen.getByText("Message number one")).toBeInTheDocument();

      expect(screen.getByText("User2")).toBeInTheDocument();
      expect(screen.getByText("12:36 PM")).toBeInTheDocument();
      expect(screen.getByText("Message number two")).toBeInTheDocument();
    });

    it("displays an error", async () => {
      render(
        <MockedProvider mocks={[errorResponse]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() =>
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument()
      );
      expect(screen.getByText("An error occurred!")).toBeInTheDocument();
    });
  });
});
