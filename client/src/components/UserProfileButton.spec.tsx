import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import userFixture from "../fixtures/userFixture";
import * as sessionProvider from "../providers/SessionProvider";
import SessionProvider, {
  GET_CURRENT_USER,
} from "../providers/SessionProvider";
import { setWindowWidth } from "../util/test-utils";
import UserProfileButton from "./UserProfileButton";

const currentUser = {
  request: {
    query: GET_CURRENT_USER,
  },
  result: {
    data: {
      currentUser: userFixture({ online: true }, 0),
    },
  },
};

describe("components", () => {
  describe("UserProfileButton", () => {
    beforeEach(() => {
      setWindowWidth(1024);
      jest.clearAllMocks();
    });

    it("opens a drawer with logout button when clicked", async () => {
      jest
        .spyOn(sessionProvider, "handleLogout")
        .mockImplementation(async () => {});

      render(
        <MockedProvider mocks={[currentUser]}>
          <SessionProvider>
            <UserProfileButton />
          </SessionProvider>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("user-profile-button")).toBeInTheDocument();
      });

      fireEvent(
        screen.getByTestId("user-profile-button"),
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
      expect(screen.getByText("User Name 0")).toBeInTheDocument();

      userEvent.click(screen.getByTestId("user-profile-container"));

      await waitFor(() => {
        expect(screen.queryByText("User Name 0")).not.toBeInTheDocument();
      });

      fireEvent(
        screen.getByTestId("user-profile-button"),
        new MouseEvent("click", { bubbles: true, cancelable: true })
      );
      userEvent.click(screen.getByTestId("logout-button"));
      expect(sessionProvider.handleLogout).toHaveBeenCalled();
    });
  });
});
