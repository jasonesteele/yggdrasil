import { MockedProvider } from "@apollo/client/testing";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SessionProvider from "../../providers/SessionProvider";
import { setWindowWidth } from "../../util/test-utils";
import ChatChannel from "./ChatChannel";

const mocks: any[] = [];

describe("components", () => {
  describe("chat", () => {
    describe("ChatChannel", () => {
      beforeEach(() => {
        setWindowWidth(1024);
      });

      it("renders the component", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <MemoryRouter>
              <SessionProvider>
                <ChatChannel channelId="test-id" />
              </SessionProvider>
            </MemoryRouter>
          </MockedProvider>
        );

        expect(screen.getByTestId("chat-channel-test-id")).toBeInTheDocument();
        expect(screen.getByTestId("chat-history")).toBeInTheDocument();
        expect(screen.getByTestId("user-list")).toBeInTheDocument();
        expect(screen.getByTestId("chat-command-input")).toBeInTheDocument();
        expect(screen.getByTestId("chat-status-activity")).toBeInTheDocument();
      });
    });
  });
});
