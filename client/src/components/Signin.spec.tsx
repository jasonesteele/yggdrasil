import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { setWindowWidth } from "../util/test-utils";
import Signin from "./Signin";

describe("components", () => {
  describe("Signin", () => {
    beforeEach(() => {
      setWindowWidth(1024);
    });

    it("renders the signin page", () => {
      render(
        <MemoryRouter>
          <Signin />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Yggdrasil is the Tree of Life/)
      ).toBeInTheDocument();
      expect(screen.queryByText("Login Error")).not.toBeInTheDocument();
    });

    it("renders the signin page with an error", () => {
      render(
        <MemoryRouter initialEntries={["/?error=Sign-in+error"]}>
          <Signin />
        </MemoryRouter>
      );

      expect(
        screen.getByText(/Yggdrasil is the Tree of Life/)
      ).toBeInTheDocument();
      expect(screen.getByText("Login Error")).toBeInTheDocument();
    });
  });
});
