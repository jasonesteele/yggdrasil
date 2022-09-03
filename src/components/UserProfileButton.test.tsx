import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { fail, setWindowWidth } from "../util/test-utils";
import UserProfileButton from "./UserProfileButton";

describe("components", () => {
  describe("UserProfileButton", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders", () => {
      render(
        <MockedProvider mocks={[]}>
          <UserProfileButton />
        </MockedProvider>
      );

      fail("not implemented");
    });
  });
});
