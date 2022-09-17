import { MockedProvider } from "@apollo/client/testing";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import moment from "moment";
import { cache } from "../../apollo-client";
import messageFixture from "../../fixtures/messageFixture";
import userFixture from "../../fixtures/userFixture";
import { setWindowWidth } from "../../util/test-utils";
import ChatHistory, { GET_CHANNEL_MESSAGES } from "./ChatHistory";

jest.mock("../../hooks/useWebSocket");

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
        messageFixture(
          {
            text: "Hello there",
            createdAt: moment("2022-01-01T13:23:00").toDate(),
            user: userFixture(undefined, 0),
          },
          0
        ),
        messageFixture(
          {
            text: "Message Two",
            createdAt: moment("2022-01-01T13:24:15").toDate(),
            user: userFixture(undefined, 1),
          },
          1
        ),
        messageFixture(
          {
            text: "Last chance",
            createdAt: moment("2022-01-02T03:59:59").toDate(),
            user: userFixture(undefined, 0),
          },
          2
        ),
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

const verifyMessage = (
  sequence: number,
  text: string,
  userName: string,
  timestamp: string
) => {
  expect(
    within(screen.getByTestId(`chat-message-${sequence}`)).getByText(text)
  ).toBeInTheDocument();
  expect(
    within(screen.getByTestId(`chat-message-${sequence}`)).getByText(userName)
  ).toBeInTheDocument();
  expect(
    within(screen.getByTestId(`chat-message-${sequence}`)).getByText(timestamp)
  ).toBeInTheDocument();
};

describe("components", () => {
  describe("ChatHistory", () => {
    beforeEach(() => {
      setWindowWidth(1024);
      cache.reset();
    });

    it("renders an empty channel", async () => {
      render(
        <MockedProvider cache={cache} mocks={[noMessages]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId("chat-message-0")).not.toBeInTheDocument();
    });

    it("renders a channel with some messages", async () => {
      render(
        <MockedProvider cache={cache} mocks={[someMessages]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument();
      });

      verifyMessage(0, "Hello there", "User Name 0", "1:23 PM");
      verifyMessage(1, "Message Two", "User Name 1", "1:24 PM");
      verifyMessage(2, "Last chance", "User Name 0", "3:59 AM");
    });

    it("dyanmically adds a new message", async () => {
      render(
        <MockedProvider cache={cache} mocks={[noMessages]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.queryByTestId("chat-message-0")).not.toBeInTheDocument();

      await act(async () => {
        if (__useWebSocket_onEvent) {
          __useWebSocket_onEvent({
            __typename: "Message",
            id: "message-0",
            text: "A wild message appears",
            createdAt: moment("2022-02-28T23:59:59").toDate(),
            user: {
              id: "abc123",
              name: "User Name 0",
              image: null,
              online: true,
            },
          });
          __useWebSocket_onEvent({
            __typename: "Message",
            id: "message-1",
            text: "It was super effective",
            createdAt: moment("2022-03-01T00:01:30").toDate(),
            user: {
              id: "abc124",
              name: "User Name 1",
              image: null,
              online: true,
            },
          });
        }
      });

      verifyMessage(0, "A wild message appears", "User Name 0", "11:59 PM");
      verifyMessage(1, "It was super effective", "User Name 1", "12:01 AM");
    });

    it("displays an error", async () => {
      render(
        <MockedProvider cache={cache} mocks={[errorResponse]}>
          <ChatHistory channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("chat-history-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByText("An error occurred!")).toBeInTheDocument();
    });

    it.todo("rolls off old messages");
  });
});
