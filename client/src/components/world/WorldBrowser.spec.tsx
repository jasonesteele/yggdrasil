import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { cache } from "../../apollo-client";
import userFixture from "../../fixtures/userFixture";
import worldFixture from "../../fixtures/worldFixture";
import SessionProvider from "../../providers/SessionProvider";
import { setWindowWidth } from "../../util/test-utils";
import WorldBrowser, { GET_WORLDS } from "./WorldBrowser";

const noWorlds: any[] = [
  {
    request: {
      query: GET_WORLDS,
    },
    result: {
      data: {
        worlds: [],
      },
    },
  },
];

const someWorlds: any[] = [
  {
    request: {
      query: GET_WORLDS,
    },
    result: {
      data: {
        worlds: [
          worldFixture(
            {
              name: "A-World 1",
              owner: userFixture(undefined, 10),
              users: [userFixture(undefined, 20)],
            },
            0
          ),
          worldFixture(
            { name: "A-World 2", owner: userFixture(undefined, 11) },
            1
          ),
          worldFixture(
            {
              name: "B-World 1",
              owner: userFixture(undefined, 11),
              users: [userFixture(undefined, 10)],
            },
            2
          ),
        ],
      },
    },
  },
];

const errorResponse: any[] = [
  {
    request: {
      query: GET_WORLDS,
    },
    error: new Error("An error occurred!"),
  },
];

describe("components", () => {
  describe("world", () => {
    describe("WorldBrowser", () => {
      beforeEach(() => {
        setWindowWidth(1024);
        cache.reset();
      });

      it("shows empty when no worlds are loaded", async () => {
        render(
          <MockedProvider mocks={noWorlds}>
            <SessionProvider>
              <MemoryRouter>
                <WorldBrowser />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        });
        expect(screen.getByText("No worlds found")).toBeInTheDocument();
      });

      it("shows worlds in the list and allows filtering by string, owner and membership", async () => {
        render(
          <MockedProvider mocks={someWorlds}>
            <SessionProvider testUser={userFixture(undefined, 10)}>
              <MemoryRouter>
                <WorldBrowser />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        });

        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("A-World 1")).toBeInTheDocument();
        expect(screen.getByText("A-World 2")).toBeInTheDocument();
        expect(screen.getByText("B-World 1")).toBeInTheDocument();
        expect(screen.getByText("Displaying 3 worlds")).toBeInTheDocument();

        await userEvent.type(
          screen.getByTestId("worlds-list-search"),
          "A-World"
        );

        expect(screen.getByText("A-World 1")).toBeInTheDocument();
        expect(screen.getByText("A-World 2")).toBeInTheDocument();
        expect(screen.queryByText("B-World 1")).not.toBeInTheDocument();
        expect(
          screen.getByText("Displaying 2 of 3 worlds")
        ).toBeInTheDocument();

        await userEvent.type(
          screen.getByTestId("worlds-list-search"),
          "{Control>}[KeyA]{/Control}{Backspace}"
        );

        expect(screen.getByText("A-World 1")).toBeInTheDocument();
        expect(screen.getByText("A-World 2")).toBeInTheDocument();
        expect(screen.getByText("B-World 1")).toBeInTheDocument();
        expect(screen.getByText("Displaying 3 worlds")).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("myworlds-filter"));

        expect(screen.getByText("Mine Only")).toBeInTheDocument();
        expect(screen.getByText("A-World 1")).toBeInTheDocument();
        expect(screen.queryByText("A-World 2")).not.toBeInTheDocument();
        expect(screen.getByText("B-World 1")).toBeInTheDocument();
        expect(
          screen.getByText("Displaying 2 of 3 worlds")
        ).toBeInTheDocument();
      });

      it("handles an error", async () => {
        render(
          <MockedProvider mocks={errorResponse}>
            <SessionProvider>
              <MemoryRouter>
                <WorldBrowser />
              </MemoryRouter>
            </SessionProvider>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        });
        expect(screen.getByText("An error occurred!")).toBeInTheDocument();
      });
    });
  });
});
