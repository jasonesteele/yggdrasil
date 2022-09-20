import worldFixture from "../../fixtures/worldFixture";
import { render, screen } from "@testing-library/react";

import WorldCard from "./WorldCard";
import { MemoryRouter } from "react-router-dom";

const world = worldFixture(undefined, 0);

describe("components", () => {
  describe("world", () => {
    describe("WorldCard", () => {
      it("renders the component", async () => {
        render(
          <MemoryRouter>
            <WorldCard world={world} />
          </MemoryRouter>
        );

        expect(screen.getByText("world-name-0")).toBeInTheDocument();
        expect(screen.getByText("world-description-0")).toBeInTheDocument();
      });
    });
  });
});
