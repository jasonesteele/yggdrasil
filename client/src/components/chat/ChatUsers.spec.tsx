import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor, within } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { cache } from "../../apollo-client";
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
  describe("chat", () => {
    describe("ChatUsers", () => {
      beforeEach(() => {
        setWindowWidth(1024);
        cache.reset();
      });

      it("renders an empty list of users", async () => {
        render(
          <MockedProvider mocks={[noUsers]}>
            <MemoryRouter>
              <ChatUsers channelId="test-channel-id" />
            </MemoryRouter>
          </MockedProvider>
        );
        await waitFor(() => {
          expect(
            screen.queryByTestId("user-list-loading")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByTestId("chat-users")).toBeEmptyDOMElement();
      });

      it("renders a list of users", async () => {
        render(
          <MockedProvider mocks={[userList]}>
            <MemoryRouter>
              <ChatUsers channelId="test-channel-id" />
            </MemoryRouter>
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
            <MemoryRouter>
              <ChatUsers channelId="test-channel-id" />
            </MemoryRouter>
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
            <MemoryRouter>
              <ChatUsers channelId="test-channel-id" />
            </MemoryRouter>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId("user-list-loading")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("An error occurred!")).toBeInTheDocument();
      });

      it("adds a user dynamically", async () => {
        render(
          <MockedProvider mocks={[noUsers]}>
            <MemoryRouter>
              <ChatUsers channelId="test-channel-id" />
            </MemoryRouter>
          </MockedProvider>
        );
        await waitFor(() => {
          expect(
            screen.queryByTestId("user-list-loading")
          ).not.toBeInTheDocument();
        });

        expect(screen.getByTestId("chat-users")).toBeEmptyDOMElement();

        await act(async () => {
          if (__useWebSocket_onEvent)
            __useWebSocket_onEvent({
              user: {
                id: "abc123",
                name: "test-user",
                image: null,
                online: true,
              },
              online: true,
            });
        });

        expect(
          within(screen.getByTestId("user-list-0")).getByText("test-user")
        ).toBeInTheDocument();
      });

      it("changes a user's online status dynamically", async () => {
        render(
          <MockedProvider cache={cache} mocks={[userList]}>
            <MemoryRouter>
              <ChatUsers channelId="test-channel-id" />
            </MemoryRouter>
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
          within(screen.getByTestId("user-list-2")).getByText("User Name 0")
        ).toBeInTheDocument();
        expect(
          within(screen.getByTestId("user-list-3")).getByText("User Name 2")
        ).toBeInTheDocument();

        await act(async () => {
          if (__useWebSocket_onEvent)
            __useWebSocket_onEvent({
              user: {
                id: "user-id-1",
                name: "User Name 1",
                image: "http://example.com/image-1.png",
                online: false,
              },
              online: false,
            });
        });

        expect(
          within(screen.getByTestId("user-list-0")).getByText("User Name 0")
        ).toBeInTheDocument();
        expect(
          within(screen.getByTestId("user-list-1")).getByText("User Name 1")
        ).toBeInTheDocument();
        expect(
          within(screen.getByTestId("user-list-2")).getByText("User Name 2")
        ).toBeInTheDocument();
      });

      it.todo("removes a user dynamically");
    });
  });
});
