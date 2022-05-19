import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import ChatWindow from "../../src/components/ChatWindow";

describe("ChatWindow", () => {
  afterEach(cleanup);

  it("accepts chat messages from the current user", () => {
    render(
      <SessionProvider
        session={{
          user: {
            name: "Sarah",
            email: "sarah@example.com",
            picture: "http://www.example.com/picture.png",
          },
        }}
      >
        <ChatWindow />
      </SessionProvider>
    );

    expect(screen.getByText("Chat")).toBeVisible();
    const input = screen.getByPlaceholderText("Type message or / command");

    fireEvent.change(input, { target: { value: "ABC" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, which: 13 });

    expect(screen.getByText("ABC")).toBeVisible();
    expect(screen.getByText("Sarah")).toBeVisible();

    fireEvent.change(input, { target: { value: "XYZ" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13, which: 13 });

    expect(screen.getByText("ABC")).toBeVisible();
    expect(screen.getByText("XYZ")).toBeVisible();
  });
});
