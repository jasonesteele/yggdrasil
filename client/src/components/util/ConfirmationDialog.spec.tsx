import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ToastProvider from "../../providers/ToastProvider";
import ConfirmationDialog from "./ConfirmationDialog";

describe("components", () => {
  describe("util", () => {
    describe("ConfirmationDialog", () => {
      it("shows with a default title and confirms", async () => {
        const onClose = jest.fn();
        render(
          <MockedProvider mocks={[]}>
            <MemoryRouter>
              <ToastProvider>
                <ConfirmationDialog
                  testid="unit-test"
                  message="dialog message"
                  open={true}
                  onClose={onClose}
                />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        expect(screen.getByTestId("unit-test")).toBeInTheDocument();
        expect(screen.getByText("Please confirm")).toBeInTheDocument();
        expect(screen.getByText("dialog message")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        userEvent.click(screen.getByText("Ok"));
        expect(onClose).toHaveBeenCalledWith(true);
      });

      it("shows with a custom title and cancels", async () => {
        const onClose = jest.fn();
        render(
          <MockedProvider mocks={[]}>
            <MemoryRouter>
              <ToastProvider>
                <ConfirmationDialog
                  testid="unit-test"
                  title="dialog title"
                  message="dialog message"
                  open={true}
                  onClose={onClose}
                />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        expect(screen.getByTestId("unit-test")).toBeInTheDocument();
        expect(screen.getByText("dialog title")).toBeInTheDocument();
        expect(screen.getByText("dialog message")).toBeInTheDocument();
        expect(screen.getByText("Ok")).toBeInTheDocument();
        userEvent.click(screen.getByText("Cancel"));
        expect(onClose).toHaveBeenCalledWith(false);
      });

      it("does not render the dialogue when not open", async () => {
        const onClose = jest.fn();
        render(
          <MockedProvider mocks={[]}>
            <MemoryRouter>
              <ToastProvider>
                <ConfirmationDialog
                  testid="unit-test"
                  title="dialog title"
                  message="dialog message"
                  open={false}
                  onClose={onClose}
                />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        expect(screen.queryByTestId("unit-test")).not.toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();
      });
    });
  });
});
