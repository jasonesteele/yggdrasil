import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import SessionProvider, {
  GET_CURRENT_USER,
  useSessionContext,
} from "./SessionProvider";

const currentUser = {
  request: {
    query: GET_CURRENT_USER,
  },
  result: {
    data: {
      currentUser: {
        id: "user-id",
        name: "user-name",
        image: "user-image",
      },
    },
  },
};

const noCurrentUser = {
  request: {
    query: GET_CURRENT_USER,
  },
  result: {
    data: {
      currentUser: undefined,
    },
  },
};

const errorResponse = {
  request: {
    query: GET_CURRENT_USER,
  },
  error: new Error("An error occurred!"),
};

const TestComponent = () => {
  const { user, error } = useSessionContext();
  return (
    <div>
      <div>{user ? user.id : "no-user"}</div>
      <div>{error ? "error-id" : "no-error"}</div>
    </div>
  );
};

describe("providers", () => {
  describe("SessionProvider", () => {
    it("provides a session with a user", async () => {
      render(
        <MockedProvider mocks={[currentUser]}>
          <SessionProvider>
            <TestComponent />
          </SessionProvider>
        </MockedProvider>
      );

      expect(await screen.findByText("user-id")).toBeInTheDocument();
    });

    it("provides a session with no user", async () => {
      render(
        <MockedProvider mocks={[noCurrentUser]}>
          <SessionProvider>
            <TestComponent />
          </SessionProvider>
        </MockedProvider>
      );

      expect(await screen.findByText("no-user")).toBeInTheDocument();
    });

    it("handles an error", async () => {
      render(
        <MockedProvider mocks={[errorResponse]}>
          <SessionProvider>
            <TestComponent />
          </SessionProvider>
        </MockedProvider>
      );

      expect(await screen.findByText("error-id")).toBeInTheDocument();
    });
  });
});

export {};
