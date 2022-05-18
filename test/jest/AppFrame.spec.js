import React from "react";
import { Button } from "@mui/material";
import { cleanup, render, screen } from "@testing-library/react";
import AppFrame from "../../src/components/AppFrame";

describe("AppFrame", () => {
  afterEach(cleanup);

  it("displays application title", () => {
    render(<AppFrame title="Application Title" />);
    expect(screen.getByText("Application Title")).toBeVisible();
  });

  it("displays right button", () => {
    render(<AppFrame rightButton={<Button data-testid="my-button" />} />);
    expect(screen.getByTestId("my-button")).toBeVisible();
  });
});
