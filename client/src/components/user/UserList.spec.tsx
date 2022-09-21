import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import userFixture from "../../fixtures/userFixture";
import SessionProvider from "../../providers/SessionProvider";
import UserList, { GET_USERS } from "./UserList";

const noUsers = {
  request: {
    query: GET_USERS,
  },
  result: {
    data: {
      users: [],
    },
  },
};

const userList = {
  request: {
    query: GET_USERS,
  },
  result: {
    data: {
      users: [
        userFixture(undefined, 0),
        userFixture({ online: true }, 1),
        userFixture(undefined, 2),
      ],
    },
  },
};

const errorResponse = {
  request: {
    query: GET_USERS,
  },
  error: new Error("An error occurred!"),
};

describe("components", () => {
  describe("user", () => {
    describe("UserList", () => {
      it("renders an empty list of users", async () => {
        render(
          <MockedProvider mocks={[noUsers]}>
            <SessionProvider>
              <MemoryRouter>
                <UserList />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId("user-list-loading")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("No users found")).toBeInTheDocument();
      });

      it("renders a list of users and filters it", async () => {
        render(
          <MockedProvider mocks={[userList]}>
            <SessionProvider>
              <MemoryRouter>
                <UserList />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId("user-list-loading")
          ).not.toBeInTheDocument();
        });

        expect(screen.getByText("Displaying 3 users")).toBeInTheDocument();
        expect(screen.getByText("User Name 0")).toBeInTheDocument();
        expect(screen.getByText("User Name 1")).toBeInTheDocument();
        expect(screen.getByText("User Name 2")).toBeInTheDocument();

        await userEvent.type(screen.getByTestId("users-list-search"), "Name 1");

        expect(screen.getByText("Displaying 1 of 3 users")).toBeInTheDocument();
        expect(screen.queryByText("User Name 0")).not.toBeInTheDocument();
        expect(screen.getByText("User Name 1")).toBeInTheDocument();
        expect(screen.queryByText("User Name 2")).not.toBeInTheDocument();

        await userEvent.type(
          screen.getByTestId("users-list-search"),
          "{Control>}[KeyA]{/Control}{Backspace}"
        );
        expect(screen.getByText("Displaying 3 users")).toBeInTheDocument();
        expect(screen.getByText("User Name 0")).toBeInTheDocument();
        expect(screen.getByText("User Name 1")).toBeInTheDocument();
        expect(screen.getByText("User Name 2")).toBeInTheDocument();
      });

      it("renders an error", async () => {
        render(
          <MockedProvider mocks={[errorResponse]}>
            <SessionProvider>
              <MemoryRouter>
                <UserList />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(
            screen.queryByTestId("user-list-loading")
          ).not.toBeInTheDocument();
        });
        expect(screen.getByText("An error occurred!")).toBeInTheDocument();
      });
    });
  });
});
