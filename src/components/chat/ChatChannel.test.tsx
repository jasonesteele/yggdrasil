import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { fail, setWindowWidth } from "../../util/test-utils";
import ChatChannel from "./ChatChannel";

describe("components", () => {
  describe("ChatChannel", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders a channel", () => {
      render(
        <MockedProvider mocks={[]}>
          <ChatChannel channelId="test-channel-id" />
        </MockedProvider>
      );

      fail("not implemented");
    });
  });
});
