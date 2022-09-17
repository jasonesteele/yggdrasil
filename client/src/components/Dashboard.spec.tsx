import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import SessionProvider from "../providers/SessionProvider";
import { setWindowWidth } from "../util/test-utils";
import Dashboard from "./Dashboard";

const mocks: any[] = [];

describe("components", () => {
  describe("Dashboard", () => {
    beforeEach(() => {
      setWindowWidth(1024);
    });

    it("renders the component", async () => {
      render(
        <MockedProvider mocks={mocks}>
          <SessionProvider>
            <Dashboard />
          </SessionProvider>
        </MockedProvider>
      );

      expect(screen.getByTestId("chat-panel")).toBeInTheDocument();
    });
  });
});
