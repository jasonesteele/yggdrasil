import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserList from "./UserList";

describe("components", () => {
  describe("user", () => {
    describe("UserList", () => {
      it("renders the component", async () => {
        // TODO: implement this
        render(
          <MemoryRouter>
            <UserList />
          </MemoryRouter>
        );
      });
    });
  });
});
