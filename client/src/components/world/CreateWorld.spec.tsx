import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateWorld from "./CreateWorld";

describe("components", () => {
  describe("world", () => {
    describe("CreateWorld", () => {
      it("renders the component", async () => {
        render(
          <MemoryRouter>
            <CreateWorld />
          </MemoryRouter>
        );

        // TODO: implement me
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });
    });
  });
});
