import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import channelActivityFixture from "fixtures/channelActivityFixture";
import { setWindowWidth } from "../../util/test-utils";
import ChatStatusBar, { GET_CHANNEL_ACTIVITY } from "./ChatStatusBar";

const noActiveUsers = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelActivity: [],
    },
  },
};

const oneActiveUser = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelActivity: [channelActivityFixture(0, 0)],
    },
  },
};

const oneOfTwoActiveUser = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelActivity: [
        channelActivityFixture(30, 0),
        channelActivityFixture(0, 1),
      ],
    },
  },
};

const twoActiveUsers = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelActivity: [
        channelActivityFixture(30, 0),
        channelActivityFixture(0, 1),
        channelActivityFixture(0, 2),
        channelActivityFixture(30, 3),
      ],
    },
  },
};

const threeActiveUsers = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelActivity: [
        channelActivityFixture(30, 0),
        channelActivityFixture(0, 1),
        channelActivityFixture(0, 2),
        channelActivityFixture(0, 3),
      ],
    },
  },
};

const manyActiveUsers = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelActivity: [
        channelActivityFixture(0, 0),
        channelActivityFixture(0, 1),
        channelActivityFixture(0, 2),
        channelActivityFixture(0, 3),
        channelActivityFixture(0, 4),
        channelActivityFixture(0, 5),
      ],
    },
  },
};

const errorResponse = {
  request: {
    query: GET_CHANNEL_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  error: new Error("An error occurred!"),
};

describe("components", () => {
  describe("ChatStatusBar", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("shows no active users", async () => {
      render(
        <MockedProvider mocks={[noActiveUsers]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        await screen.findByTestId("chat-status-connected")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("chat-status-disconnected")).toBeNull();
      expect(screen.getByTestId("chat-status-activity").innerHTML).toEqual(" ");
    });

    it("shows one of one active user", async () => {
      render(
        <MockedProvider mocks={[oneActiveUser]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        await screen.findByTestId("chat-status-connected")
      ).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-activity").innerHTML).toContain(
        "User Name 0 is typing..."
      );
    });

    it("shows one of two active users", async () => {
      render(
        <MockedProvider mocks={[oneOfTwoActiveUser]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        await screen.findByTestId("chat-status-connected")
      ).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-activity").innerHTML).toContain(
        "User Name 1 is typing..."
      );
    });

    it("shows two active users", async () => {
      render(
        <MockedProvider mocks={[twoActiveUsers]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        await screen.findByTestId("chat-status-connected")
      ).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-activity").innerHTML).toContain(
        "User Name 1 and User Name 2 are typing..."
      );
    });

    it("shows three active users", async () => {
      render(
        <MockedProvider mocks={[threeActiveUsers]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        await screen.findByTestId("chat-status-connected")
      ).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-activity").innerHTML).toContain(
        "User Name 1, User Name 2 and User Name 3 are typing..."
      );
    });

    it("shows more than three active users", async () => {
      render(
        <MockedProvider mocks={[manyActiveUsers]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        await screen.findByTestId("chat-status-connected")
      ).toBeInTheDocument();
      expect(screen.getByTestId("chat-status-activity").innerHTML).toContain(
        "User Name 0, User Name 1 and four others are typing..."
      );
    });

    it("shows a connection problem", async () => {
      render(
        <MockedProvider mocks={[errorResponse]}>
          <ChatStatusBar channelId="test-channel-id" />
        </MockedProvider>
      );
      expect(
        screen.queryByTestId("chat-status-disconnected")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("chat-status-connected")).toBeNull();
    });
  });
});
