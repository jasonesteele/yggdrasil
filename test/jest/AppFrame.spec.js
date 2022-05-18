import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import AppFrame from "../../src/components/AppFrame";

describe("AppFrame", () => {
  afterEach(cleanup);

  it("displays application title", () => {
    render(<AppFrame title="Application Title" />);
    expect(screen.getByText("Application Title")).toBeVisible();
    expect(screen.queryByText("Logout")).toBeNull();
  });

  it("displays right button", () => {
    render(
      <AppFrame
        title="Application Title"
        user={{
          name: "Sarah",
          email: "sarah@example.com",
          picture: "http://www.example.com/picture.png",
        }}
      />
    );
    expect(screen.getByText("Application Title")).toBeVisible();
    expect(screen.getByText("Logout")).toBeVisible();
  });
});
