// LogInPage.spec.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  getAuth,
} from "firebase/auth";
import SignInPage from "../pages/LoginPage"; // Adjust path as needed
import { useNavigate } from "react-router-dom";

// Mock Firebase auth functions and React Router's navigate
jest.mock("firebase/auth", () => {
  const actualAuth = jest.requireActual("firebase/auth");
  return {
    ...actualAuth,
    getAuth: jest.fn(() => ({
      currentUser: null,
    })),
    signInWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SignInPage", () => {
  const mockSignIn = signInWithEmailAndPassword as jest.Mock;
  const mockSendPasswordReset = sendPasswordResetEmail as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Mock window.alert
  beforeAll(() => {
    window.alert = jest.fn();
  });

  test("renders the sign-in form", () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("handles successful sign-in", async () => {
    mockSignIn.mockResolvedValueOnce({
      user: { uid: "123", email: "test@example.com" },
    });

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    });

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com",
        "password123"
      )
    );

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("handles sign-in failure", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("Invalid credentials"));

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    });

    await waitFor(() => expect(mockSignIn).toHaveBeenCalled());

    expect(window.alert).toHaveBeenCalledWith(
      "Sign in failed: Invalid credentials"
    );
  });

  test("handles password reset success", async () => {
    mockSendPasswordReset.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/click here/i));
    });

    await waitFor(() =>
      expect(mockSendPasswordReset).toHaveBeenCalledWith(
        expect.anything(),
        "test@example.com"
      )
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Password reset email sent! Please check your inbox."
    );
  });

  test("alerts if email is missing for password reset", async () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.click(screen.getByText(/click here/i));
    });

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter your email address to reset your password."
    );
  });
});
