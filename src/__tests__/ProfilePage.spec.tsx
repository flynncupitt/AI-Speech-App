// ProfilePage.spec.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import ProfilePage from "../pages/ProfilePage";

// Mock Firebase functions
jest.mock("firebase/auth", () => {
  return {
    onAuthStateChanged: jest.fn((_, callback) => {
      if (typeof callback === "function") {
        callback({
          uid: "user123",
          email: "test@example.com",
          displayName: "Test User",
        });
      }
      return jest.fn(); // Return a mock unsubscribe function
    }),
    getAuth: jest.fn(() => ({
      currentUser: {
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
      },
    })),
    updatePassword: jest.fn(),
    reauthenticateWithCredential: jest.fn(),
    EmailAuthProvider: {
      credential: jest.fn((email, password) => ({ email, password })),
    },
  };
});

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error to suppress errors in tests

  window.alert = jest.fn();
});

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("allows user to change password", async () => {
    const mockUpdatePassword = updatePassword as jest.Mock;
    const mockReauthenticateWithCredential =
      reauthenticateWithCredential as jest.Mock;
    const auth = getAuth();

    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );

    // Wait for the profile page to render
    await waitFor(() => {
      expect(screen.getByText(/your profile/i)).toBeInTheDocument();
    });

    // Change password
    const currentPasswordInput = screen.getByTestId("CurrentPassword");
    const newPasswordInput = screen.getByTestId("NewPassword");
    fireEvent.change(currentPasswordInput, {
      target: { value: "oldPassword123" },
    });
    fireEvent.change(newPasswordInput, { target: { value: "newPassword123" } });

    // Verify the input values (for debugging purposes)
    console.log(
      "Current Password Value:",
      (currentPasswordInput as HTMLInputElement).value
    );
    console.log(
      "New Password Value:",
      (newPasswordInput as HTMLInputElement).value
    );

    // Click on the "Change Password" button
    const changePasswordButton = screen.getByTestId("ChangePassword");
    await act(async () => {
      fireEvent.click(changePasswordButton);
    });

    // Log to verify if the password change function is called
    console.log("Checking if updatePassword is called");

    // Wait for reauthentication and password change
    await waitFor(() => {
      expect(mockReauthenticateWithCredential).toHaveBeenCalledWith(
        auth.currentUser,
        expect.any(Object)
      );
      expect(mockUpdatePassword).toHaveBeenCalledWith(
        auth.currentUser,
        "newPassword123"
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Password changed successfully!");
  });
});
