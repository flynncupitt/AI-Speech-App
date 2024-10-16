// GoalDone.spec.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { deleteDoc } from "firebase/firestore";
import DonePage from "../components/DonePage";
import { onAuthStateChanged } from "firebase/auth";

// Mock Firebase functions
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    doc: jest.fn(),
    deleteDoc: jest.fn(),
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

describe("DonePage", () => {
  const mockDeleteDoc = deleteDoc as jest.Mock;
  const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deletes a completed goal", async () => {
    jest.setTimeout(15000);

    mockOnAuthStateChanged.mockImplementation((callback) => {
      if (typeof callback === "function") {
        callback({ uid: "user123" });
      }
      return () => {};
    });

    mockDeleteDoc.mockResolvedValueOnce({});

    const doneGoals = [
      {
        id: "goal1",
        title: "Completed Goal",
        description: "Goal Description",
        progress: 100,
        total: 1,
        tasks: ["Task 1"],
        completed: true,
      },
    ];

    const setGoals = jest.fn();
    const setSuccessMessage = jest.fn();

    render(
      <MemoryRouter>
        <DonePage
          doneGoals={doneGoals}
          setGoals={setGoals}
          setSuccessMessage={setSuccessMessage}
        />
      </MemoryRouter>
    );

    // Click the 3-dot menu button to reveal the delete option
    const menuButton = await screen.findByRole("button", { name: /•••/i });
    fireEvent.click(menuButton);

    // Click the delete button for the completed goal
    const deleteButton = await screen.findByText(/delete/i);
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    // Verify that deleteDoc was called and setGoals was updated
    await waitFor(() => {
      expect(mockDeleteDoc).toHaveBeenCalled();
      expect(setGoals).toHaveBeenCalledWith([]);
      expect(setSuccessMessage).toHaveBeenCalledWith(
        "Completed goal deleted successfully!"
      );
    });
  });
});
