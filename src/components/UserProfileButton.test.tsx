import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import userFixture from "fixtures/userFixture";
import moment from "moment";
import { SessionProvider } from "next-auth/react";
import { fail, setWindowWidth } from "../util/test-utils";
import UserProfileButton from "./UserProfileButton";

describe("components", () => {
  describe("UserProfileButton", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders", async () => {
      render(
        <SessionProvider
          session={{
            user: userFixture({}, 0),
            expires: moment().add(1, "days").toISOString(),
          }}
        >
          <MockedProvider mocks={[]}>
            <UserProfileButton />
          </MockedProvider>
        </SessionProvider>
      );

      const profileButton = await screen.findByTestId("user-profile-button");
      fireEvent.click(profileButton);
      expect(await screen.findByTestId("logout-button")).toBeInTheDocument();
      fireEvent.keyPress(profileButton, { type: "keydown", key: "Tab" });
    });
  });
});
