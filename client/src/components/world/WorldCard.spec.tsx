import worldFixture from "../../fixtures/worldFixture";
import { render, screen } from "@testing-library/react";

import WorldCard from "./WorldCard";

const world = worldFixture(undefined, 0);

describe("components", () => {
  describe("world", () => {
    describe("WorldCard", () => {
      it("renders the component", async () => {
        render(<WorldCard world={world} />);

        expect(screen.getByText("world-name-0")).toBeInTheDocument();
        expect(screen.getByText("world-description-0")).toBeInTheDocument();
      });
    });
  });
});
