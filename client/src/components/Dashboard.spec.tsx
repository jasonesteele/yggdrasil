import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userFixture from "../fixtures/userFixture";
import SessionProvider, {
  GET_CURRENT_USER,
} from "../providers/SessionProvider";
import { setWindowWidth } from "../util/test-utils";
import Dashboard from "./Dashboard";

const currentUser = [
  {
    request: {
      query: GET_CURRENT_USER,
    },
    result: {
      data: {
        currentUser: userFixture({ online: true }, 0),
      },
    },
  },
];

const noUser = [
  {
    request: {
      query: GET_CURRENT_USER,
    },
    result: {
      data: {
        currentUser: null,
      },
    },
  },
];

describe("components", () => {
  describe("Dashboard", () => {
    beforeEach(() => {
      setWindowWidth(1024);
    });

    it("renders a component", async () => {
      render(
        <MockedProvider mocks={currentUser}>
          <SessionProvider>
            <MemoryRouter>
              <Dashboard>
                <div>Test</div>
              </Dashboard>
            </MemoryRouter>
          </SessionProvider>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Test")).toBeInTheDocument();
      });
      expect(screen.getByTestId("chat-panel")).toBeInTheDocument();
    });

    it("shows a signin screen when no user is logged in", async () => {
      render(
        <MockedProvider mocks={noUser}>
          <SessionProvider>
            <MemoryRouter>
              <Dashboard>
                <div>Test</div>
              </Dashboard>
            </MemoryRouter>
          </SessionProvider>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Yggdrasil is the Tree of Life/)
        ).toBeInTheDocument();
      });
      expect(screen.queryByTestId("chat-panel")).not.toBeInTheDocument();
    });
  });
});
