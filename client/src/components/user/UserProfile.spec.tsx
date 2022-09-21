import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userFixture from "../../fixtures/userFixture";
import SessionProvider, {
  GET_CURRENT_USER,
} from "../../providers/SessionProvider";
import UserProfile, { GET_USER } from "./UserProfile";

const mocks = [
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
  {
    request: {
      query: GET_USER,
      variables: {
        userId: "user-id-1",
      },
    },
    result: {
      data: {
        user: userFixture({ online: true }, 1),
      },
    },
  },
  {
    request: {
      query: GET_USER,
      variables: {
        userId: "user-id-2",
      },
    },
    result: {
      data: {
        user: userFixture({ online: false }, 2),
      },
    },
  },
];

describe("components", () => {
  describe("user", () => {
    describe("UserProfile", () => {
      it("renders the component for an online user", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <SessionProvider>
              <MemoryRouter initialEntries={["/user/user-id-1"]}>
                <Routes>
                  <Route path="/user/:id" element={<UserProfile />} />
                </Routes>
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.getAllByText("User Name 1")).toHaveLength(2);
        });
        expect(screen.getByText("Online")).toBeInTheDocument();
      });

      it("renders the component for an offline user", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <SessionProvider>
              <MemoryRouter initialEntries={["/user/user-id-2"]}>
                <Routes>
                  <Route path="/user/:id" element={<UserProfile />} />
                </Routes>
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.getAllByText("User Name 2")).toHaveLength(2);
        });
        expect(screen.getByText("Offline")).toBeInTheDocument();
      });
    });
  });
});
