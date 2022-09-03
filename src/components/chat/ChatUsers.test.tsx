import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { fail, setWindowWidth } from "../../util/test-utils";
import ChatUsers from "./ChatUsers";

describe("components", () => {
  describe("ChatUsers", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders an empty list of users", async () => {
      render(
        <MockedProvider mocks={[]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      fail("Not implemented");
    });

    it("renders a list of users", async () => {
      render(
        <MockedProvider mocks={[]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      fail("Not implemented");
    });

    it("renders a list of users (small screen)", async () => {
      setWindowWidth(600);
      render(
        <MockedProvider mocks={[]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      fail("Not implemented");
    });

    it("shows an error", async () => {
      render(
        <MockedProvider mocks={[]}>
          <ChatUsers channelId="test-channel-id" />
        </MockedProvider>
      );

      fail("Not implemented");
    });
  });
});
