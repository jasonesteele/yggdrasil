import worldFixture from "../../fixtures/worldFixture";
import { render, screen, waitFor } from "@testing-library/react";

import WorldCard from "./WorldCard";
import { MemoryRouter } from "react-router-dom";
import userFixture from "../../fixtures/userFixture";
import userEvent from "@testing-library/user-event";

const world = worldFixture({ owner: userFixture(undefined, 1) }, 0);

describe("components", () => {
  describe("world", () => {
    describe("WorldCard", () => {
      it("renders a world card and processes deletion", async () => {
        const onDelete = jest.fn();

        render(
          <MemoryRouter>
            <WorldCard world={world} onDelete={onDelete} />
          </MemoryRouter>
        );

        expect(screen.getByText("world-name-0")).toBeInTheDocument();
        expect(screen.getByText("world-description-0")).toBeInTheDocument();
        expect(screen.getByText("User Name 1")).toBeInTheDocument();

        userEvent.click(screen.getByTestId("close-world-button"));
        expect(screen.getByText("Delete world-name-0?")).toBeInTheDocument();
        userEvent.click(screen.getByText("Cancel"), {
          bubbles: true,
          cancelable: true,
        });

        await waitFor(() => {
          expect(
            screen.queryByText("Delete world-name-0?")
          ).not.toBeInTheDocument();
        });
        expect(onDelete).not.toHaveBeenCalled();

        userEvent.click(screen.getByTestId("close-world-button"));
        expect(screen.getByText("Delete world-name-0?")).toBeInTheDocument();
        userEvent.click(screen.getByText("Ok"), {
          bubbles: true,
          cancelable: true,
        });

        expect(onDelete).toHaveBeenCalled();
      });
    });
  });
});
