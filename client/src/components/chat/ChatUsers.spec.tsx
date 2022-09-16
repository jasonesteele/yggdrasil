import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor, within } from "@testing-library/react";
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
      channelUsers: [
        userFixture(undefined, 0),
        userFixture({ online: true }, 1),
        userFixture(undefined, 2),
      ],
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

      expect(
        within(screen.getByTestId("user-list-0")).getByText("User Name 1")
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("user-list-0")).getByAltText("User Name 1")
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId("user-list-2")).getByText("User Name 0")
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("user-list-2")).getByAltText("User Name 0")
      ).toBeInTheDocument();

      expect(
        within(screen.getByTestId("user-list-3")).getByText("User Name 2")
      ).toBeInTheDocument();
      expect(
        within(screen.getByTestId("user-list-3")).getByAltText("User Name 2")
      ).toBeInTheDocument();
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

      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        within(screen.getByTestId("user-list-0")).queryByText("User Name 1")
      ).not.toBeInTheDocument();
      expect(
        within(screen.getByTestId("user-list-0")).getByAltText("User Name 1")
      ).toBeInTheDocument();

      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        within(screen.getByTestId("user-list-2")).queryByText("User Name 0")
      ).not.toBeInTheDocument();
      expect(
        within(screen.getByTestId("user-list-2")).getByAltText("User Name 0")
      ).toBeInTheDocument();

      expect(
        // eslint-disable-next-line testing-library/prefer-presence-queries
        within(screen.getByTestId("user-list-3")).queryByText("User Name 2")
      ).not.toBeInTheDocument();
      expect(
        within(screen.getByTestId("user-list-3")).getByAltText("User Name 2")
      ).toBeInTheDocument();
    });

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

    it.todo("adds a user dynamically");
    it.todo("removes a user dynamically");
    it.todo("changes a user's online status dynamically");
  });
});
