import { MockedProvider } from "@apollo/react-testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userFixture from "fixtures/userFixture";
import moment from "moment";
import { SessionProvider } from "next-auth/react";
import { NOTIFY_ACTIVITY } from "src/hooks/useNotifyActivity";
import { POST_MESSAGE } from "src/hooks/useSendMessage";
import { setWindowWidth } from "../../util/test-utils";
import ChatCommandField from "./ChatCommandField";

const noUserPostMessage = {
  request: {
    query: POST_MESSAGE,
    variables: {
      channelId: "test-channel-id",
      text: "sample command",
    },
  },
  newData: jest.fn(() => ({
    data: {
      postMessage: {
        id: "messsage-id",
        createdAt: moment("2020-02-14T12:34:56Z").toDate(),
        text: "A test message",
        user: {
          id: "user-id",
        },
      },
      notifyActivity: {
        success: true,
      },
    },
  })),
};

const noUserNotifyActivity = {
  request: {
    query: NOTIFY_ACTIVITY,
    variables: {
      channelId: "test-channel-id",
    },
  },
  newData: jest.fn(() => ({
    data: {
      notifyActivity: {
        success: true,
      },
    },
  })),
};

const noUserCancelActivity = {
  request: {
    query: NOTIFY_ACTIVITY,
    variables: {
      channelId: null,
    },
  },
  newData: jest.fn(() => ({
    data: {
      notifyActivity: {
        success: true,
      },
    },
  })),
};

const errorPostMessage = {
  request: {
    query: POST_MESSAGE,
    variables: {
      channelId: "test-channel-id",
      text: "sample command",
    },
  },
  error: new Error("An error occurred!"),
};

describe("components", () => {
  describe("ChatCommandField", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("sends a chat message on the channel", async () => {
      render(
        <SessionProvider
          session={{
            user: userFixture({}, 0),
            expires: moment().add(1, "days").toISOString(),
          }}
        >
          <MockedProvider
            mocks={[
              noUserPostMessage,
              noUserNotifyActivity,
              noUserCancelActivity,
            ]}
          >
            <ChatCommandField channelId="test-channel-id" />
          </MockedProvider>
        </SessionProvider>
      );

      fireEvent.change(
        screen.getByPlaceholderText("Type message or /command"),
        { target: { value: "sample command" } }
      );
      await waitFor(() =>
        expect(noUserCancelActivity.newData).not.toHaveBeenCalled()
      );

      fireEvent.keyDown(
        screen.getByPlaceholderText("Type message or /command"),
        { key: "Enter" }
      );

      await waitFor(() => expect(noUserPostMessage.newData).toHaveBeenCalled());
      expect(noUserNotifyActivity.newData).toHaveBeenCalled();

      fireEvent.change(
        screen.getByPlaceholderText("Type message or /command"),
        { target: { value: "" } }
      );
      await waitFor(() =>
        expect(noUserCancelActivity.newData).toHaveBeenCalled()
      );
    });

    it("shows error indicator when message fails to post", async () => {
      render(
        <SessionProvider
          session={{
            user: userFixture({}, 0),
            expires: moment().add(1, "days").toISOString(),
          }}
        >
          <MockedProvider mocks={[errorPostMessage]}>
            <ChatCommandField channelId="test-channel-id" />
          </MockedProvider>
        </SessionProvider>
      );

      fireEvent.change(
        screen.getByPlaceholderText("Type message or /command"),
        { target: { value: "sample command" } }
      );

      fireEvent.keyDown(
        screen.getByPlaceholderText("Type message or /command"),
        { key: "Enter" }
      );

      await waitFor(() =>
        expect(screen.getByText("An error occurred!")).toBeInTheDocument()
      );
    });
  });
});
