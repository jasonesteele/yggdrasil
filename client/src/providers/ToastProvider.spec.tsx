import { render } from "@testing-library/react";
import ToastProvider from "./ToastProvider";

describe("providers", () => {
  describe("ToastProvider", () => {
    it("provides toast services", () => {
      // TODO: implement me
      render(
        <ToastProvider>
          <div>Hello</div>
        </ToastProvider>
      );
    });
  });
});
