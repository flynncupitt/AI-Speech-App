// UserRecordings.spec.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import UserRecordings from "../pages/RecordingsPage";
import { firestore, auth } from "../config/firebaseconfig";
import { useNavigate } from "react-router-dom";

// Mock Firebase functions
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
  };
});

jest.mock("firebase/auth", () => {
  return {
    onAuthStateChanged: jest.fn(),
    getAuth: jest.fn(() => ({
      currentUser: { uid: "user123" },
    })),
  };
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockNavigate = useNavigate as jest.Mock;
const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;
const mockGetDocs = getDocs as jest.Mock;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // Mock console.error
});

describe("UserRecordings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders recordings after fetching", async () => {
    console.log("Setting up mock for onAuthStateChanged...");
    mockOnAuthStateChanged.mockImplementation((callback) => {
      console.log("Invoking onAuthStateChanged callback with user123...");
      if (typeof callback === "function") {
        callback({ uid: "user123" });
      }
      return () => {};
    });

    console.log("Setting up mock for Firestore getDocs...");
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "recording1",
          data: () => ({
            filename: "recording1.mp3",
            createdAt: { seconds: 1697510400 },
            downloadURL: "https://example.com/recording1.mp3",
          }),
        },
      ],
    });

    console.log("Rendering UserRecordings component...");
    render(
      <MemoryRouter>
        <UserRecordings />
      </MemoryRouter>
    );

    // Wait for the "Loading recordings..." message to disappear
    await screen.findByTestId("my-recordings");
    expect(screen.getByText(/recording1.mp3/i)).toBeInTheDocument();
    expect(screen.getByText(/view results/i)).toBeInTheDocument();
  });
});
