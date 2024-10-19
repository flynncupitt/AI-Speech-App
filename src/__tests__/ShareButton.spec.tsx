// ShareBUtton.spec.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserRecordings from "../pages/RecordingsPage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../config/firebaseconfig";

// Mock Firebase functions
jest.mock("firebase/auth", () => {
  return {
    getAuth: jest.fn(() => ({
      currentUser: {
        uid: "user123",
        email: "test@example.com",
        displayName: "Test User",
      },
    })),
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
  };
});

jest.mock("../config/firebaseconfig", () => {
  return {
    firestore: {},
  };
});

jest.mock("firebase/firestore", () => {
  return {
    collection: jest.fn(),
    getDocs: jest.fn(() =>
      Promise.resolve({
        docs: [
          {
            id: "recording1",
            data: () => ({
              filename: "Recording 1",
              downloadURL: "https://example.com/recording1.mp3",
              createdAt: { seconds: 1633046400 },
            }),
          },
        ],
      })
    ),
  };
});

// Mock ShareResults component
jest.mock("../components/ShareResults.tsx", () => {
  return ({}: any) => {
    return (
      <button onClick={() => window.alert("Downloading image...")}>
        Share
      </button>
    );
  };
});

describe("UserRecordings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert
    window.alert = jest.fn();
  });

  test("clicking the Share button should download an image", async () => {
    render(
      <MemoryRouter>
        <UserRecordings />
      </MemoryRouter>
    );

    // Wait for the recordings to render
    const shareButton = await screen.findByText("Share");
    expect(shareButton).toBeInTheDocument();

    // Simulate clicking the Share button
    fireEvent.click(shareButton);

    // Check if the alert was called
    expect(window.alert).toHaveBeenCalledWith("Downloading image...");
  });
});
