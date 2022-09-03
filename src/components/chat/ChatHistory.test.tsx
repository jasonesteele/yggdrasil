import { MockedProvider } from "@apollo/client/testing";
import { fail, setWindowWidth } from "../../util/test-utils";
import ChatHistory from "./ChatHistory";

describe("components", () => {
  describe("ChatHistory", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders an empty channel", () => {
      <MockedProvider mocks={[]}>
        <ChatHistory channelId="test-channel-id" />
      </MockedProvider>;

      fail("not implemented");
    });

    it("renders a channel with some messages", () => {
      <MockedProvider mocks={[]}>
        <ChatHistory channelId="test-channel-id" />
      </MockedProvider>;

      fail("not implemented");
    });

    it("displays an error", () => {
      <MockedProvider mocks={[]}>
        <ChatHistory channelId="test-channel-id" />
      </MockedProvider>;

      fail("not implemented");
    });
  });
});
