import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import userFixture from "../../fixtures/userFixture";
import SessionProvider from "../../providers/SessionProvider";
import ToastProvider from "../../providers/ToastProvider";
import { setWindowWidth } from "../../util/test-utils";
import ChatCommandField, { POST_MESSAGE } from "./ChatCommandField";

const mocks = [
  {
    request: {
      query: POST_MESSAGE,
      variables: {
        channelId: "test-channel",
        text: "Sample Message",
      },
    },
    newData: jest.fn(() => ({
      data: {
        postMessage: {
          id: "message-0",
          createdAt: moment().toDate(),
          text: "Sample Message",
          user: userFixture(undefined, 0),
        },
      },
    })),
  },
];

const errorMocks = [
  {
    request: {
      query: POST_MESSAGE,
      variables: {
        channelId: "test-channel",
        text: "Sample Message",
      },
    },
    error: new Error("An error occurred!"),
  },
];

describe("components", () => {
  describe("chat", () => {
    describe("ChatCommandField", () => {
      beforeEach(() => {
        setWindowWidth(1024);
      });

      it("sends a chat message on the channel", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <SessionProvider>
              <ChatCommandField channelId="test-channel" />
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
        });

        global.__useWebSocket_sendEvent = jest.fn();

        await userEvent.type(
          screen.getByTestId("chat-command-input"),
          "Sample Message{Enter}"
        );
        await waitFor(() => expect(mocks[0].newData).toHaveBeenCalled());

        expect(__useWebSocket_sendEvent).toHaveBeenCalledWith({
          channelId: "test-channel",
          active: true,
        });
      });

      it("clears activity notification when input cleared", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <SessionProvider>
              <ChatCommandField channelId="test-channel" />
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
        });

        global.__useWebSocket_sendEvent = jest.fn();

        await userEvent.type(
          screen.getByTestId("chat-command-input"),
          "Sample Message"
        );

        expect(__useWebSocket_sendEvent).toHaveBeenCalledWith({
          channelId: "test-channel",
          active: true,
        });

        await userEvent.type(
          screen.getByTestId("chat-command-input"),
          "{Control>}[KeyA]{/Control}{Backspace}"
        );

        expect(__useWebSocket_sendEvent).toHaveBeenCalledWith({
          channelId: "test-channel",
          active: false,
        });
      });

      it("shows error indicator when message fails to post", async () => {
        render(
          <MockedProvider mocks={errorMocks}>
            <SessionProvider>
              <ToastProvider>
                <ChatCommandField channelId="test-channel" />
              </ToastProvider>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
        });

        await userEvent.type(
          screen.getByTestId("chat-command-input"),
          "Sample Message{Enter}"
        );

        await waitFor(() => {
          expect(screen.getByText("An error occurred!")).toBeInTheDocument();
        });
      });
    });
  });
});
