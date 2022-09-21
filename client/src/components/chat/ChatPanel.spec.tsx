import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SessionProvider from "../../providers/SessionProvider";
import { setWindowWidth } from "../../util/test-utils";
import ChatPanel, { GET_SUBSCRIBED_CHANNELS } from "./ChatPanel";

const noChannels = [
  {
    request: {
      query: GET_SUBSCRIBED_CHANNELS,
    },
    result: {
      data: {
        subscribedChannels: [],
      },
    },
  },
];

const oneChannel = [
  {
    request: {
      query: GET_SUBSCRIBED_CHANNELS,
    },
    result: {
      data: {
        subscribedChannels: [
          {
            id: "channel-1",
            name: "Channel 1",
          },
        ],
      },
    },
  },
];

const threeChannels = [
  {
    request: {
      query: GET_SUBSCRIBED_CHANNELS,
    },
    result: {
      data: {
        subscribedChannels: [
          {
            id: "channel-1",
            name: "Channel 1",
          },
          {
            id: "channel-2",
            name: "Channel 2",
          },
          {
            id: "channel-3",
            name: "Channel 3",
          },
        ],
      },
    },
  },
];

const errorResponse = [
  {
    request: {
      query: GET_SUBSCRIBED_CHANNELS,
    },
    error: new Error("An error occurred!"),
  },
];

describe("components", () => {
  describe("chat", () => {
    describe("ChatPanel", () => {
      beforeEach(() => {
        setWindowWidth(1024);
      });

      it("renders the chat panel with no channels", async () => {
        render(
          <MockedProvider mocks={noChannels}>
            <MemoryRouter>
              <SessionProvider>
                <ChatPanel />
              </SessionProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByText("Loading chat channels...")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("No subscribed channels")).toBeInTheDocument();
      });

      it("renders the chat panel with one channel", async () => {
        render(
          <MockedProvider mocks={oneChannel}>
            <MemoryRouter>
              <SessionProvider>
                <ChatPanel />
              </SessionProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByText("Loading chat channels...")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("Channel 1")).toBeInTheDocument();
        expect(
          screen.getByTestId("chat-channel-channel-1")
        ).toBeInTheDocument();
      });

      it("renders the chat panel with many channels", async () => {
        render(
          <MockedProvider mocks={threeChannels}>
            <MemoryRouter>
              <SessionProvider>
                <ChatPanel />
              </SessionProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByText("Loading chat channels...")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("Channel 1")).toBeInTheDocument();
        expect(screen.getByText("Channel 2")).toBeInTheDocument();
        expect(screen.getByText("Channel 3")).toBeInTheDocument();

        expect(
          screen.getByTestId("chat-channel-channel-1")
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId("chat-channel-channel-2")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("chat-channel-channel-3")
        ).not.toBeInTheDocument();

        userEvent.click(screen.getByText("Channel 2"));

        expect(
          screen.queryByTestId("chat-channel-channel-1")
        ).not.toBeInTheDocument();
        expect(
          screen.getByTestId("chat-channel-channel-2")
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId("chat-channel-channel-3")
        ).not.toBeInTheDocument();
      });

      it("handles an error", async () => {
        render(
          <MockedProvider mocks={errorResponse}>
            <MemoryRouter>
              <SessionProvider>
                <ChatPanel />
              </SessionProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByText("Loading chat channels...")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("An error occurred!")).toBeInTheDocument();
      });
    });
  });
});
