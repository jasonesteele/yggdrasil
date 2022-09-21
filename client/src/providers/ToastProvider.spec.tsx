import { Button } from "@mui/material";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToastProvider, { useToastContext } from "./ToastProvider";

describe("providers", () => {
  describe("ToastProvider", () => {
    it("provides toast services", async () => {
      const Component = () => {
        const { showToast } = useToastContext();

        return (
          <Button
            onClick={() =>
              showToast({ severity: "error", message: "toast message" })
            }
          >
            Show
          </Button>
        );
      };
      render(
        <ToastProvider>
          <Component />
        </ToastProvider>
      );

      expect(screen.queryByText("toast message")).not.toBeInTheDocument();
      await userEvent.click(screen.getByText("Show"));
      expect(screen.getByText("toast message")).toBeInTheDocument();
      await userEvent.click(screen.getByTestId("CloseIcon"));
      await waitFor(() => {
        expect(screen.queryByText("toast message")).not.toBeInTheDocument();
      });
    });
  });
});
