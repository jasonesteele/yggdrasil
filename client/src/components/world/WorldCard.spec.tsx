import { render, screen, waitFor } from "@testing-library/react";
import worldFixture from "../../fixtures/worldFixture";

import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import userFixture from "../../fixtures/userFixture";
import SessionProvider from "../../providers/SessionProvider";
import WorldCard from "./WorldCard";

const world = worldFixture({ owner: userFixture(undefined, 1) }, 0);

describe("components", () => {
  describe("world", () => {
    describe("WorldCard", () => {
      it("renders a world card and processes deletion", async () => {
        const onDelete = jest.fn();

        render(
          <MemoryRouter>
            <MockedProvider>
              <SessionProvider testUser={userFixture(undefined, 1)}>
                <WorldCard world={world} onDelete={onDelete} />
              </SessionProvider>
            </MockedProvider>
          </MemoryRouter>
        );

        expect(screen.getByText("world-name-0")).toBeInTheDocument();
        expect(screen.getByText("world-description-0")).toBeInTheDocument();
        expect(screen.getByText("User Name 1")).toBeInTheDocument();

        await userEvent.click(screen.getByTestId("close-world-button"));
        expect(screen.getByText("Delete world-name-0?")).toBeInTheDocument();
        await userEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
          expect(
            screen.queryByText("Delete world-name-0?")
          ).not.toBeInTheDocument();
        });
        expect(onDelete).not.toHaveBeenCalled();

        await userEvent.click(screen.getByTestId("close-world-button"));
        expect(screen.getByText("Delete world-name-0?")).toBeInTheDocument();
        await userEvent.click(screen.getByText("Ok"));

        expect(onDelete).toHaveBeenCalled();
      });

      it.todo('let\'s me join a world');
      it.todo('let\'s me leave a world');
      it.todo('does not let me leave a world I own');
      it.todo('let\'s me play in a world');
    });
  });
});
