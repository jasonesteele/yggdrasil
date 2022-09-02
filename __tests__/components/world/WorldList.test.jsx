import { MockedProvider } from "@apollo/react-testing";
import { fireEvent, render, screen } from "@testing-library/react";
import userFixture from "../../../fixtures/userFixture";
import worldFixture from "../../../fixtures/worldFixture";
import WorldList, { GET_WORLDS } from "../../../src/components/WorldList";

const successResponse = [
  {
    request: {
      query: GET_WORLDS,
    },
    result: {
      data: {
        worlds: [
          worldFixture({ owner: userFixture() }, 0),
          worldFixture({ owner: userFixture() }, 1),
        ],
      },
    },
  },
];

const emptyResponse = [
  {
    request: {
      query: GET_WORLDS,
    },
    result: {
      data: {
        worlds: [],
      },
    },
  },
];

const networkErrorResponse = [
  {
    request: {
      query: GET_WORLDS,
    },
    error: new Error("An error occurred!"),
  },
];

describe("components", () => {
  describe("WorldList", () => {
    it("renders a world", async () => {
      render(
        <MockedProvider mocks={successResponse}>
          <WorldList />
        </MockedProvider>
      );

      expect(await screen.findByText("World Name 0")).toBeInTheDocument();
      expect(await screen.findByText("World Name 1")).toBeInTheDocument();

      fireEvent.change(screen.getByTestId("worldlist-search"), {
        target: { value: "Name 1" },
      });

      expect(await screen.queryByText("World Name 0")).not.toBeInTheDocument();
      expect(await screen.findByText("World Name 1")).toBeInTheDocument();

      fireEvent.change(screen.getByTestId("worldlist-search"), {
        target: { value: "Foobar" },
      });

      expect(await screen.queryByText("World Name 0")).not.toBeInTheDocument();
      expect(await screen.queryByText("World Name 1")).not.toBeInTheDocument();
      expect(await screen.findByText("No matching worlds")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("worldlist-search-reset"));

      expect(await screen.findByText("World Name 0")).toBeInTheDocument();
      expect(await screen.findByText("World Name 1")).toBeInTheDocument();
      expect(
        await screen.queryByText("No matching worlds")
      ).not.toBeInTheDocument();
    });

    it("renders a network error", async () => {
      render(
        <MockedProvider mocks={networkErrorResponse}>
          <WorldList />
        </MockedProvider>
      );

      expect(
        await screen.findByText("Error retrieving worlds")
      ).toBeInTheDocument();
      expect(await screen.findByText("An error occurred!")).toBeInTheDocument();
    });

    it("renders a world", async () => {
      render(
        <MockedProvider mocks={emptyResponse}>
          <WorldList />
        </MockedProvider>
      );

      expect(
        await screen.findByText("No worlds available")
      ).toBeInTheDocument();
    });
  });
});
