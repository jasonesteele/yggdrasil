import { MockedProvider } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
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

      await userEvent.click(screen.getByTestId("user-profile-button"));
      expect(screen.getByText("User Name 0")).toBeInTheDocument();

      await userEvent.click(screen.getByTestId("user-profile-container"));

      await waitFor(() => {
        expect(screen.queryByText("User Name 0")).not.toBeInTheDocument();
      });

      await userEvent.click(screen.getByTestId("user-profile-button"));
      await userEvent.click(screen.getByTestId("logout-button"));
      expect(sessionProvider.handleLogout).toHaveBeenCalled();
    });
  });
});
