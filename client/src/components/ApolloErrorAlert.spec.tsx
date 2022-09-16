import { ApolloError } from "@apollo/client";
import { render, screen } from "@testing-library/react";
import { GraphQLError } from "graphql";
import { setWindowWidth } from "../util/test-utils";
import ApolloErrorAlert from "./ApolloErrorAlert";

describe("components", () => {
  describe("ApolloErrorAlert", () => {
    beforeEach(async () => {
      setWindowWidth(1024);
    });

    it("renders a network error", async () => {
      render(
        <ApolloErrorAlert
          title="Error Title"
          error={
            new ApolloError({ networkError: new Error("Here's an error") })
          }
        />
      );

      expect(await screen.findByText("Error Title")).toBeInTheDocument();
      expect(await screen.findByText("Here's an error")).toBeInTheDocument();
    });

    it("renders a GraphQL error", async () => {
      render(
        <ApolloErrorAlert
          title="Error Title"
          error={
            new ApolloError({
              graphQLErrors: [new GraphQLError("Here's an error")],
            })
          }
        />
      );

      expect(await screen.findByText("Error Title")).toBeInTheDocument();
      expect(await screen.findByText("Here's an error")).toBeInTheDocument();
    });

    it("renders multiple GraphQL errors", async () => {
      render(
        <ApolloErrorAlert
          title="Error Title"
          error={
            new ApolloError({
              graphQLErrors: [
                new GraphQLError("Here's the first error"),
                new GraphQLError("Here's the second error"),
              ],
            })
          }
        />
      );

      expect(await screen.findByText("Error Title")).toBeInTheDocument();
      expect(
        await screen.findByText("Here's the first error")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Here's the second error")
      ).toBeInTheDocument();
    });

    it("renders a client error", async () => {
      render(
        <ApolloErrorAlert
          title="Error Title"
          error={
            new ApolloError({ clientErrors: [new Error("Here's an error")] })
          }
        />
      );

      expect(await screen.findByText("Error Title")).toBeInTheDocument();
      expect(await screen.findByText("Here's an error")).toBeInTheDocument();
    });

    it("renders multiple client errors", async () => {
      render(
        <ApolloErrorAlert
          title="Error Title"
          error={
            new ApolloError({
              clientErrors: [
                new Error("Here's the first error"),
                new Error("Here's the second error"),
              ],
            })
          }
        />
      );

      expect(await screen.findByText("Error Title")).toBeInTheDocument();
      expect(
        await screen.findByText("Here's the first error")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Here's the second error")
      ).toBeInTheDocument();
    });
  });
});
