import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";

describe("components", () => {
  describe("util", () => {
    describe("Breadcrumbs", () => {
      it("renders the component", async () => {
        // TODO: implement this
        render(
          <MemoryRouter>
            <Breadcrumbs pageLabel="Home" />
          </MemoryRouter>
        );
      });
    });
  });
});
