import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { fail, setWindowWidth } from "../util/test-utils";
import AppFrame from "./AppFrame";

describe("components", () => {
  describe("AppFrame", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders", () => {
      render(
        <MockedProvider mocks={[]}>
          <AppFrame title="Test Title" />
        </MockedProvider>
      );

      fail("not implemented");
    });
  });
});
