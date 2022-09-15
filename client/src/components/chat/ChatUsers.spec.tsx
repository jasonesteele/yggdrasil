import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userFixture from "../../fixtures/userFixture";
import { setWindowWidth } from "../../util/test-utils";
import ChatUsers, { GET_CHANNEL_USERS } from "./ChatUsers";

const noUsers = {
  request: {
    query: GET_CHANNEL_USERS,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelUsers: [],
    },
  },
};

const userList = {
  request: {
    query: GET_CHANNEL_USERS,
    variables: {
      channelId: "test-channel-id",
    },
  },
  result: {
    data: {
      channelUsers: [userFixture(undefined, 0), userFixture(undefined, 1)],
    },
  },
};

const errorResponse = {
  request: {
    query: GET_CHANNEL_USERS,
    variables: {
      channelId: "test-channel-id",
    },
  },
  error: new Error("An error occurred!"),
};

describe("components", () => {
  describe("ChatUsers", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders an empty list of users", async () => {
      render(
        <MockedProvider mocks={[noUsers]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(
          screen.queryByTestId("user-list-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByTestId("user-list")).toBeEmptyDOMElement();
    });

    it("renders a list of users", async () => {
      render(
        <MockedProvider mocks={[userList]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("user-list-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByText("User Name 0")).toBeInTheDocument();
      expect(screen.getByTestId("user-avatar-0")).toBeInTheDocument();
      expect(screen.getByText("User Name 1")).toBeInTheDocument();
      expect(screen.getByTestId("user-avatar-1")).toBeInTheDocument();
    });

    it("renders a list of users (small screen)", async () => {
      setWindowWidth(600);

      render(
        <MockedProvider mocks={[userList]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("user-list-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.queryByText("User Name 0")).not.toBeInTheDocument();
      expect(screen.getByTestId("user-avatar-0")).toBeInTheDocument();
      expect(screen.queryByText("User Name 1")).not.toBeInTheDocument();
      expect(screen.getByTestId("user-avatar-1")).toBeInTheDocument();
    });

    it.todo("sorts offline users to the bottom");
    it.todo("adds a user dynamically");
    it.todo("removes a user dynamically");
    it.todo("changes a user's online status dynamically");

    it("shows an error", async () => {
      render(
        <MockedProvider mocks={[errorResponse]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.queryByTestId("user-list-loading")
        ).not.toBeInTheDocument();
      });
      expect(screen.getByText("An error occurred!")).toBeInTheDocument();
    });
  });
});
