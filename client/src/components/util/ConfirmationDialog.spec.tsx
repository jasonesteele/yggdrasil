import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ConfirmationDialog from "./ConfirmationDialog";

describe("components", () => {
  describe("util", () => {
    describe("ConfirmationDialog", () => {
      it("renders the dialogue when open", async () => {
        const onClose = jest.fn();
        render(
          <MemoryRouter>
            <ConfirmationDialog
              message={"dialog message"}
              open={false}
              onClose={onClose}
            />
          </MemoryRouter>
        );

        // TODO: implement me
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });

      it.todo("does not render the dialogue when not open");
    });
  });
});
