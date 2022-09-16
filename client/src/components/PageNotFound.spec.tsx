import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { setWindowWidth } from "../util/test-utils";
import PageNotFound from "./PageNotFound";

describe("components", () => {
  describe("PageNotFound", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders the component", () => {
      render(
        <MemoryRouter>
          <PageNotFound />
        </MemoryRouter>
      );

      expect(screen.getByText("Page not found")).toBeInTheDocument();
    });
  });
});
