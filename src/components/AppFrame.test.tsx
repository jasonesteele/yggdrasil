import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userFixture from "fixtures/userFixture";
import moment from "moment";
import { SessionProvider } from "next-auth/react";
import { setWindowWidth } from "../util/test-utils";
import AppFrame from "./AppFrame";

describe("components", () => {
  describe("AppFrame", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders when user logged in", async () => {
      render(
        <SessionProvider
          session={{
            user: userFixture({}, 0),
            expires: moment().add(1, "days").toISOString(),
          }}
        >
          <MockedProvider mocks={[]}>
            <AppFrame title="Test Title">
              <div>Hello World</div>
            </AppFrame>
          </MockedProvider>
        </SessionProvider>
      );

      expect(await screen.findByText("Test Title")).toBeInTheDocument();
      expect(await screen.findByText("Hello World")).toBeInTheDocument();
      expect(
        await screen.findByTestId("user-profile-button")
      ).toBeInTheDocument();
    });

    it("renders when user not logged in", async () => {
      render(
        <SessionProvider session={null}>
          <MockedProvider mocks={[]}>
            <AppFrame title="Test Title">
              <div>Hello World</div>
            </AppFrame>
          </MockedProvider>
        </SessionProvider>
      );

      expect(await screen.findByText("Test Title")).toBeInTheDocument();
      expect(await screen.findByText("Hello World")).toBeInTheDocument();
      expect(
        await screen.findByTestId("discord-login-button")
      ).toBeInTheDocument();
    });
  });
});
