import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ToastProvider from "../../providers/ToastProvider";
import ConfirmationDialog from "./ConfirmationDialog";

describe("components", () => {
  describe("util", () => {
    describe("ConfirmationDialog", () => {
      it("renders the dialogue when open", async () => {
        const onClose = jest.fn();
        render(
          <MockedProvider mocks={[]}>
            <MemoryRouter>
              <ToastProvider>
                <ConfirmationDialog
                  message={"dialog message"}
                  open={true}
                  onClose={onClose}
                />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        // TODO: implement me
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });

      it.todo("does not render the dialogue when not open");
    });
  });
});
