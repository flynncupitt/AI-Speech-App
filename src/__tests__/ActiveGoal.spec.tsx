// ActivePage.spec.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import { firestore, auth } from "../config/firebaseconfig";
import ActivePage from "../components/ActivePage";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

// Mock Firebase functions
jest.mock("firebase/firestore", () => {
  return {
    getFirestore: jest.fn(),
    doc: jest.fn(),
    updateDoc: jest.fn(),
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

jest.mock("uuid", () => ({
  v4: jest.fn(() => "new-goal-id"),
}));

describe("ActivePage", () => {
  const mockUpdateDoc = updateDoc as jest.Mock;
  const mockDeleteDoc = deleteDoc as jest.Mock;
  const mockOnAuthStateChanged = onAuthStateChanged as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adds a new goal", async () => {
    jest.setTimeout(15000);

    mockOnAuthStateChanged.mockImplementation((callback) => {
      if (typeof callback === "function") {
        callback({ uid: "user123" });
      }
      return () => {};
    });

    const addGoal = jest.fn();
    const setGoals = jest.fn();
    const setSuccessMessage = jest.fn();

    render(
      <MemoryRouter>
        <ActivePage
          activeGoals={[]}
          addGoal={addGoal}
          completeGoal={jest.fn()}
          setGoals={setGoals}
          setSuccessMessage={setSuccessMessage}
        />
      </MemoryRouter>
    );

    // Click the "+ Add a goal" button
    const addGoalButton = await screen.findByTestId("add-a-goal");
    fireEvent.click(addGoalButton);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/goal title/i), {
      target: { value: "New Goal" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your plan/i), {
      target: { value: "Goal Description" },
    });

    // Add a task
    const addTaskButton = await screen.findByText(/add task/i);
    fireEvent.click(addTaskButton);
    fireEvent.change(screen.getByPlaceholderText(/task 1/i), {
      target: { value: "Task 1" },
    });

    // Click the submit button
    const submitButton = await screen.findByRole("button", { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify that addGoal was called with the new goal
    await waitFor(() => {
      expect(addGoal).toHaveBeenCalledWith({
        id: "new-goal-id",
        title: "New Goal",
        description: "Goal Description",
        tasks: ["Task 1"],
        progress: 0,
        total: 1,
        completed: false,
      });
      expect(setSuccessMessage).toHaveBeenCalledWith(
        "Goal added successfully!"
      );
    });
  });

  test("edits an existing goal", async () => {
    jest.setTimeout(15000);

    mockOnAuthStateChanged.mockImplementation((callback) => {
      if (typeof callback === "function") {
        callback({ uid: "user123" });
      }
      return () => {};
    });

    mockUpdateDoc.mockResolvedValueOnce({});

    const activeGoals = [
      {
        id: "goal1",
        title: "Existing Goal",
        description: "Existing Description",
        progress: 0,
        total: 1,
        tasks: ["Task 1"],
        completed: false,
      },
    ];

    const setGoals = jest.fn();
    const setSuccessMessage = jest.fn();

    render(
      <MemoryRouter>
        <ActivePage
          activeGoals={activeGoals}
          addGoal={jest.fn()}
          completeGoal={jest.fn()}
          setGoals={setGoals}
          setSuccessMessage={setSuccessMessage}
        />
      </MemoryRouter>
    );

    // Open the edit menu for the existing goal
    const menuButton = await screen.findByText(/•••/i);
    fireEvent.click(menuButton);

    // Click the edit button
    const editButton = await screen.findByText(/edit/i);
    fireEvent.click(editButton);

    // Update the form
    fireEvent.change(screen.getByPlaceholderText(/goal title/i), {
      target: { value: "Updated Goal" },
    });
    fireEvent.change(screen.getByPlaceholderText(/your plan/i), {
      target: { value: "Updated Description" },
    });

    // Click the update button
    const updateButton = await screen.findByRole("button", { name: /update/i });
    await act(async () => {
      fireEvent.click(updateButton);
    });

    // Verify that updateDoc was called and setGoals was updated
    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
      expect(setGoals).toHaveBeenCalledWith([
        {
          id: "goal1",
          title: "Updated Goal",
          description: "Updated Description",
          tasks: ["Task 1"],
          progress: 0,
          total: 1,
          completed: false,
        },
      ]);
      expect(setSuccessMessage).toHaveBeenCalledWith(
        "Goal updated successfully!"
      );
    });
  });
});
