import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ToastProvider from "../../providers/ToastProvider";
import CreateWorld from "./CreateWorld";

describe("components", () => {
  describe("world", () => {
    describe("CreateWorld", () => {
      it("renders the component", async () => {
        render(
          <MockedProvider mocks={[]}>
            <MemoryRouter>
              <ToastProvider>
                <CreateWorld />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        // TODO: implement me
        expect(screen.getByText("Cancel")).toBeInTheDocument();
      });
    });
  });
});
