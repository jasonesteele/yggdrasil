import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserProfile from "./UserProfile";

describe("components", () => {
  describe("user", () => {
    describe("UserProfile", () => {
      it("renders the component", async () => {
        render(
          <MemoryRouter>
            <UserProfile />
          </MemoryRouter>
        );
      });
    });
  });
});
