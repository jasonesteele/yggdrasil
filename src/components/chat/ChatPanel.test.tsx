import { MockedProvider } from "@apollo/client/testing";
import { fail, setWindowWidth } from "../../util/test-utils";
import ChatPanel from "./ChatPanel";

describe("components", () => {
  describe("ChatPanel", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders global channel", () => {
      <MockedProvider mocks={[]}>
        <ChatPanel />
      </MockedProvider>;
      fail("not implemented");
    });

    it("renders global and world channel", () => {
      <MockedProvider mocks={[]}>
        <ChatPanel />
      </MockedProvider>;
      fail("not implemented");
    });

    it("renders global, world and location channel", () => {
      <MockedProvider mocks={[]}>
        <ChatPanel />
      </MockedProvider>;
      fail("not implemented");
    });

    it("renders no channels", () => {
      <MockedProvider mocks={[]}>
        <ChatPanel />
      </MockedProvider>;
      fail("not implemented");
    });

    it("display an error", () => {
      <MockedProvider mocks={[]}>
        <ChatPanel />
      </MockedProvider>;
      fail("not implemented");
    });
  });
});
