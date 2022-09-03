import { ApolloError } from "@apollo/client";
import { render } from "@testing-library/react";
import { fail, setWindowWidth } from "../util/test-utils";
import ApolloErrorAlert from "./ApolloErrorAlert";

describe("components", () => {
  describe("ApolloErrorAlert", () => {
    beforeAll(() => {
      setWindowWidth(1024);
    });

    it("renders a network error", () => {
      render(
        <ApolloErrorAlert title="Error Title" error={new ApolloError({})} />
      );

      fail("not implemented");
    });

    it("renders a GraphQL error", () => {
      render(
        <ApolloErrorAlert title="Error Title" error={new ApolloError({})} />
      );

      fail("not implemented");
    });

    it("renders a client error", () => {
      render(
        <ApolloErrorAlert title="Error Title" error={new ApolloError({})} />
      );

      fail("not implemented");
    });
  });
});
