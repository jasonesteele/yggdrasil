import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { object, string } from "yup";
import InlineEditField from "./InlineEditField";

describe("components", () => {
  describe("util", () => {
    describe("InlineEditField", () => {
      it("displays a label and button if not edittable", () => {
        render(
          <InlineEditField
            value={"a value"}
            inputProps={{ "data-testid": "edit-field" }}
          />
        );

        expect(screen.getByText("a value")).toBeInTheDocument();
        expect(screen.queryByTestId("edit-field")).not.toBeInTheDocument();
        expect(screen.queryByTestId("edit-button")).not.toBeInTheDocument();
      });

      it("allows editting of a value", async () => {
        const onChange = jest.fn();
        render(
          <InlineEditField
            isEdittable={true}
            value={"a value"}
            inputProps={{ "data-testid": "edit-field" }}
            onChange={onChange}
          />
        );

        expect(screen.getByText("a value")).toBeInTheDocument();
        expect(screen.queryByTestId("edit-field")).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId("edit-button"));
        await waitFor(() => {
          expect(screen.getByTestId("edit-field")).toBeInTheDocument();
        });
        userEvent.type(
          screen.getByTestId("edit-field"),
          "{Control>}[KeyA]{/Control}new-value"
        );
        expect(onChange).not.toHaveBeenCalled();
        userEvent.type(screen.getByTestId("edit-field"), "{Enter}");
        expect(onChange).not.toHaveBeenCalledWith("new-value");
      });

      it("allows cancelling of the edit", async () => {
        const onChange = jest.fn();
        render(
          <InlineEditField
            isEdittable={true}
            value={"a value"}
            inputProps={{ "data-testid": "edit-field" }}
            onChange={onChange}
          />
        );

        expect(screen.getByText("a value")).toBeInTheDocument();
        expect(screen.queryByTestId("edit-field")).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId("edit-button"));
        await waitFor(() => {
          expect(screen.getByTestId("edit-field")).toBeInTheDocument();
        });
        userEvent.type(
          screen.getByTestId("edit-field"),
          "{Control>}[KeyA]{/Control}new-value"
        );
        expect(onChange).not.toHaveBeenCalled();
        userEvent.click(screen.getByTestId("close-button"));
        await waitFor(() => {
          expect(screen.queryByTestId("edit-field")).not.toBeInTheDocument();
        });
      });

      it("handles pre-save validation errors", async () => {
        const onChange = jest.fn();
        const schema = object({
          field: string().trim().required().min(10),
        });
        const validate = async (value: string) => {
          try {
            await schema.validate({ field: value });
          } catch (error: any) {
            console.error(error);
            return error;
          }
        };
        render(
          <InlineEditField
            isEdittable={true}
            value={"a value"}
            inputProps={{ "data-testid": "edit-field" }}
            onChange={onChange}
            validate={validate}
          />
        );

        expect(screen.getByText("a value")).toBeInTheDocument();
        expect(screen.queryByTestId("edit-field")).not.toBeInTheDocument();
        userEvent.click(screen.getByTestId("edit-button"));
        await waitFor(() => {
          expect(screen.getByTestId("edit-field")).toBeInTheDocument();
        });
        userEvent.type(
          screen.getByTestId("edit-field"),
          "{Control>}[KeyA]{/Control}ne"
        );
        expect(onChange).not.toHaveBeenCalled();
        await waitFor(() => {
          expect(
            screen.getByText("field must be at least 10 characters")
          ).toBeInTheDocument();
        });
      });
    });
  });
});
