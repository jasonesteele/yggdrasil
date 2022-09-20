import { MockedProvider } from "@apollo/client/testing";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SessionProvider from "../../providers/SessionProvider";
import UserList from "./UserList";

describe("components", () => {
  describe("user", () => {
    describe("UserList", () => {
      it("renders the component", async () => {
        // TODO: implement this
        render(
          <MockedProvider mocks={[]}>
            <SessionProvider>
              <MemoryRouter>
                <UserList />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );
      });
    });
  });
});
