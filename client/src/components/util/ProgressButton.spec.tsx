import { render, screen } from "@testing-library/react";
import ProgressButton from "./ProgressButton";

describe("components", () => {
  describe("util", () => {
    describe("ProgressButton", () => {
      it("shows the button without the spinner", async () => {
        render(<ProgressButton loading={false}>Hello</ProgressButton>);

        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.queryByTestId("button-spinner")).not.toBeInTheDocument();
      });

      it("shows the button with the spinner", async () => {
        render(<ProgressButton loading={true}>Hello</ProgressButton>);

        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
      });
    });
  });
});
