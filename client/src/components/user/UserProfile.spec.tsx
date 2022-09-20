import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SessionProvider from "../../providers/SessionProvider";
import UserProfile from "./UserProfile";

describe("components", () => {
  describe("user", () => {
    describe("UserProfile", () => {
      it("renders the component", async () => {
        // TODO: implement this
        render(
          <MockedProvider mocks={[]}>
            <SessionProvider>
              <MemoryRouter>
                <UserProfile />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );
      });
    });
  });
});
