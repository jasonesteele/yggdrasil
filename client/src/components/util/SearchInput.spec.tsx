import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

describe("components", () => {
  describe("util", () => {
    describe("SearchInput", () => {
      it("updates the search filter when a user types", async () => {
        const setSearchFilter = jest.fn();
        render(
          <SearchInput
            searchFilter=""
            setSearchFilter={setSearchFilter}
            dataTestId="test-id"
          />
        );

        await userEvent.type(screen.getByTestId("test-id"), "foo");
        expect(setSearchFilter).toHaveBeenCalledWith("f");
        expect(setSearchFilter).toHaveBeenCalledWith("o");
        expect(setSearchFilter).toHaveBeenCalledWith("o");
      });

      it("clears the search filter when button is pressed", async () => {
        const setSearchFilter = jest.fn();
        render(
          <SearchInput
            searchFilter="some search string"
            setSearchFilter={setSearchFilter}
            dataTestId="test-id"
          />
        );

        expect(
          screen.getByDisplayValue("some search string")
        ).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("search-filter-close"));
        expect(setSearchFilter).toHaveBeenCalledWith("");
      });
    });
  });
});
