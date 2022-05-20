import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import AppFrame from "../../src/components/AppFrame";
import { SessionProvider } from "next-auth/react";

describe("AppFrame", () => {
  afterEach(cleanup);

  it("displays application title", () => {
    render(
      <SessionProvider session={{}}>
        <AppFrame title="Application Title" />
      </SessionProvider>
    );
    expect(screen.getByText("Application Title")).toBeVisible();
    expect(screen.queryByText("Logout")).toBeNull();
  });

  it("displays right button", () => {
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
        <AppFrame title="Application Title" />
      </SessionProvider>
    );
    expect(screen.getByText("Application Title")).toBeVisible();
    expect(screen.getByLabelText("User Profile")).toBeVisible();

    const button = screen.getByLabelText("User Profile");
    expect(button).toBeVisible();

    expect(screen.queryByText("Logout")).toBeNull();

    fireEvent.click(button, { target: { value: "ABC" }, bubbles: true });

    expect(screen.getByText("Logout")).toBeVisible();
  });
});
