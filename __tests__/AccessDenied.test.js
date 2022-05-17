import AccessDenied from "../src/components/AccessDenied";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(cleanup);

it("displays not authorized text", () => {
  render(<AccessDenied />);
  expect(screen.getByTitle("Access Denied")).toBeVisible();
});
