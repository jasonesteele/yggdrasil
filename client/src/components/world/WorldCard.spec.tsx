import { render, screen, waitFor } from "@testing-library/react";
import worldFixture from "../../fixtures/worldFixture";

import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { cache } from "../../apollo-client";
import userFixture from "../../fixtures/userFixture";
import SessionProvider from "../../providers/SessionProvider";
import ToastProvider from "../../providers/ToastProvider";
import { setWindowWidth } from "../../util/test-utils";
import WorldCard, { JOIN_WORLD, LEAVE_WORLD } from "./WorldCard";

const currentUser = userFixture(undefined, 1);
const worldToJoin = worldFixture(
  { owner: userFixture(undefined, 2), users: [] },
  0
);
const worldToLeave = worldFixture(
  { owner: userFixture(undefined, 2), users: [currentUser] },
  0
);
const myWorld = worldFixture({ owner: currentUser, users: [currentUser] }, 0);

const worldToJoinMocks = [
  {
    request: {
      query: JOIN_WORLD,
      variables: {
        worldId: worldToJoin.id,
      },
    },
    result: {
      data: {
        joinWorld: {
          success: true,
        },
      },
    },
  },
];

const worldToLeaveMocks = [
  {
    request: {
      query: LEAVE_WORLD,
      variables: {
        worldId: worldToLeave.id,
      },
    },
    result: {
      data: {
        leaveWorld: {
          success: true,
        },
      },
    },
  },
];

describe("components", () => {
  describe("world", () => {
    describe("WorldCard", () => {
      beforeEach(() => {
        setWindowWidth(1024);
        cache.reset();
      });

      it("renders a world card and processes deletion", async () => {
        const onDelete = jest.fn();

        render(
          <MemoryRouter>
            <MockedProvider>
              <SessionProvider testUser={currentUser}>
                <ToastProvider>
                  <WorldCard world={myWorld} onDelete={onDelete} />
                </ToastProvider>
              </SessionProvider>
            </MockedProvider>
          </MemoryRouter>
        );

        expect(await screen.findByText(myWorld.name)).toBeInTheDocument();

        expect(screen.getByText(myWorld.name)).toBeInTheDocument();
        expect(screen.getByText(myWorld.description)).toBeInTheDocument();
        expect(screen.getByText(currentUser.name)).toBeInTheDocument();

        expect(
          screen.queryByTestId("leave-world-button")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("join-world-button")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("enter-world-button")).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("close-world-button"));
        expect(screen.getByText(`Delete ${myWorld.name}?`)).toBeInTheDocument();
        await userEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
          expect(
            screen.queryByText(`Delete ${myWorld.name}?`)
          ).not.toBeInTheDocument();
        });
        expect(onDelete).not.toHaveBeenCalled();

        await userEvent.click(screen.getByTestId("close-world-button"));
        expect(screen.getByText(`Delete ${myWorld.name}?`)).toBeInTheDocument();
        await userEvent.click(screen.getByText("Ok"));

        expect(onDelete).toHaveBeenCalled();
      });

      it("lets me join a world I am not already a member of", async () => {
        render(
          <MemoryRouter>
            <MockedProvider mocks={worldToJoinMocks}>
              <SessionProvider testUser={currentUser}>
                <ToastProvider>
                  <WorldCard world={worldToJoin} />
                </ToastProvider>
              </SessionProvider>
            </MockedProvider>
          </MemoryRouter>
        );

        expect(await screen.findByText(worldToJoin.name)).toBeInTheDocument();

        expect(
          screen.queryByTestId("leave-world-button")
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("enter-world-button")
        ).not.toBeInTheDocument();

        await userEvent.click(screen.getByTestId("join-world-button"));

        await waitFor(() => {
          expect(
            screen.getByText(`Joined ${worldToJoin.name}`)
          ).toBeInTheDocument();
        });
      });

      it("lets me leave a world I am a member of", async () => {
        render(
          <MemoryRouter>
            <MockedProvider mocks={worldToLeaveMocks}>
              <SessionProvider testUser={currentUser}>
                <ToastProvider>
                  <WorldCard world={worldToLeave} />
                </ToastProvider>
              </SessionProvider>
            </MockedProvider>
          </MemoryRouter>
        );

        expect(await screen.findByText(worldToLeave.name)).toBeInTheDocument();

        expect(
          screen.queryByTestId("join-world-button")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("enter-world-button")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("leave-world-button"));

        await waitFor(() => {
          expect(
            screen.getByText(`Left ${worldToJoin.name}`)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
