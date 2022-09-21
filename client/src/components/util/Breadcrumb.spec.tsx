import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { createBrowserHistory } from "history";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";

describe("components", () => {
  describe("util", () => {
    describe("Breadcrumbs", () => {
      it("renders simple breadcrumb", async () => {
        render(
          <MemoryRouter>
            <Breadcrumbs pageLabel="Home" />
          </MemoryRouter>
        );

        expect(screen.getByText("Home")).toBeInTheDocument();
      });

      it("renders a breadcrumb with a path", async () => {
        const history = createBrowserHistory();
        render(
          <HistoryRouter history={history}>
            <Breadcrumbs
              path={[
                { label: "Foo", link: "/foo" },
                { label: "Bar", link: "/bar" },
              ]}
              pageLabel="Baz"
            />
          </HistoryRouter>
        );

        expect(history.location.pathname).toEqual("/");
        await userEvent.click(screen.getByText("Foo"));
        expect(history.location.pathname).toEqual("/foo");
        await userEvent.click(screen.getByText("Bar"));
        expect(history.location.pathname).toEqual("/bar");
        await userEvent.click(screen.getByText("Baz"));
        expect(history.location.pathname).toEqual("/bar");
      });
    });
  });
});
