import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ToastProvider from "../../providers/ToastProvider";
import CreateWorld, { CREATE_WORLD } from "./CreateWorld";

const mocks = [
  {
    request: {
      query: CREATE_WORLD,
      variables: {
        name: "test-world",
      },
    },
    newData: jest.fn(() => ({
      data: {
        createWorld: {
          world: {
            id: "abc123",
            name: "test-world",
          },
        },
      },
    })),
  },
  {
    request: {
      query: CREATE_WORLD,
      variables: {
        name: "test-world",
        description: "test-description",
      },
    },
    newData: jest.fn(() => ({
      data: {
        createWorld: {
          world: {
            id: "abc123",
            name: "test-world",
          },
        },
      },
    })),
  },
];

const validationErrorMocks = [
  {
    request: {
      query: CREATE_WORLD,
      variables: {
        name: "test-world",
      },
    },
    result: {
      data: {
        createWorld: {
          world: {
            id: "abc123",
            name: "test-world",
          },
          validationErrors: [
            {
              field: "name",
              message: "name-validation-error",
            },
            {
              field: "description",
              message: "description-validation-error",
            },
          ],
        },
      },
    },
  },
];

const errorMocks = [
  {
    request: {
      query: CREATE_WORLD,
      variables: {
        name: "test-world",
      },
    },
    error: new Error("An error occurred!"),
  },
];

describe("components", () => {
  describe("world", () => {
    describe("CreateWorld", () => {
      it("creates a new world with no description", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <MemoryRouter>
              <ToastProvider>
                <CreateWorld />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );
        await userEvent.type(screen.getByTestId("world-name"), "test-world");
        await userEvent.click(screen.getByText("Create"));
        await waitFor(() => expect(mocks[0].newData).toHaveBeenCalled());
      });

      it("creates a new world with a description", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <MemoryRouter>
              <ToastProvider>
                <CreateWorld />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );
        await userEvent.type(screen.getByTestId("world-name"), "test-world");
        await userEvent.type(
          screen.getByTestId("world-description"),
          "test-description"
        );
        await userEvent.click(screen.getByText("Create"));
        await waitFor(() => expect(mocks[1].newData).toHaveBeenCalled());
      });

      it("shows validation errors and then clears them", async () => {
        render(
          <MockedProvider mocks={mocks}>
            <MemoryRouter>
              <ToastProvider>
                <CreateWorld />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );
        await userEvent.type(screen.getByTestId("world-name"), "t");
        await userEvent.type(screen.getByTestId("world-description"), "t");
        await userEvent.click(screen.getByText("Create"));

        expect(
          await screen.findByText("name must be at least 5 characters")
        ).toBeInTheDocument();
        expect(
          await screen.findByText("description must be at least 10 characters")
        ).toBeInTheDocument();

        expect(mocks[1].newData).not.toHaveBeenCalled();

        // eslint-disable-next-line testing-library/no-unnecessary-act
        await userEvent.type(
          screen.getByTestId("world-name"),
          "{Control>}[KeyA]{/Control}test-world"
        );
        await userEvent.type(
          screen.getByTestId("world-description"),
          "{Control>}[KeyA]{/Control}test-description"
        );

        await waitFor(() => {
          expect(
            screen.queryByText("name must be at least 5 characters")
          ).not.toBeInTheDocument();
        });

        await userEvent.click(screen.getByText("Create"));

        await waitFor(() => expect(mocks[1].newData).toHaveBeenCalled());
      });

      it("displays a post-submit validation error", async () => {
        render(
          <MockedProvider mocks={validationErrorMocks}>
            <MemoryRouter>
              <ToastProvider>
                <CreateWorld />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );
        await userEvent.type(screen.getByTestId("world-name"), "test-world");
        await userEvent.click(screen.getByText("Create"));
        expect(
          await screen.findByText("name-validation-error")
        ).toBeInTheDocument();
        expect(
          await screen.findByText("description-validation-error")
        ).toBeInTheDocument();
      });

      it("displays a non-validation error", async () => {
        render(
          <MockedProvider mocks={errorMocks}>
            <MemoryRouter>
              <ToastProvider>
                <CreateWorld />
              </ToastProvider>
            </MemoryRouter>
          </MockedProvider>
        );
        await userEvent.type(screen.getByTestId("world-name"), "test-world");
        await userEvent.click(screen.getByText("Create"));
        await waitFor(() => {
          expect(screen.getByText("An error occurred!")).toBeInTheDocument();
        });
      });
    });
  });
});
