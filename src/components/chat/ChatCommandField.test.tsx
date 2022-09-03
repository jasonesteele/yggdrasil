import { MockedProvider } from "@apollo/react-testing";
import { render } from "@testing-library/react";
import { fail, setWindowWidth } from "../../util/test-utils";
import ChatCommandField from "./ChatCommandField";

describe("components", () => {
  describe("ChatCommandField", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("sends a chat message on the channel", async () => {
      render(
        <MockedProvider mocks={[]}>
          <ChatCommandField channelId="test-channel-id" />
        </MockedProvider>
      );

      fail("Not implemented");
    });
  });
});
