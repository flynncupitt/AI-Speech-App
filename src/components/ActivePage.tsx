import React, { useState } from "react";
import Goal from "./Goal";
import { v4 as uuidv4 } from "uuid";
import { updateDoc, doc } from "firebase/firestore";
import { firestore, auth } from "../config/firebaseconfig";
import { deleteDoc } from "firebase/firestore";

interface GoalType {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  tasks: string[];
  completed: boolean;
}

interface ActivePageProps {
  activeGoals: GoalType[];
  addGoal: (goal: GoalType) => void;
  completeGoal: (id: string, completedTasks: boolean[]) => void;
  setGoals: (goals: GoalType[]) => void;
  setSuccessMessage: (message: string | null) => void;
}

const ActivePage: React.FC<ActivePageProps> = ({
  activeGoals,
  addGoal,
  completeGoal,
  setGoals,
  setSuccessMessage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    tasks: [""],
  });
  const [tasks, setTasks] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const maxChars = 200; //Description words limit
  const clearMessage = () => {
    setMessage("");
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const input = e.target.value;
    if (input.length <= maxChars) {
      setNewGoal({ ...newGoal, description: input });
      setCharCount(input.length);
    }
  };

  const handleAddTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = tasks.map((task, i) => (i === index ? value : task));
    setTasks(updatedTasks);
  };

  const handleAddGoal = async () => {
    if (newGoal.title.trim() === "" || newGoal.description.trim() === "") {
      setMessage("Error: Goal title and description cannot be empty!");
      return;
    }

    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const validTasks = tasks.filter((task) => task.trim() !== "");

    // If we're editing an existing goal
    if (editingGoalId) {
      // Create the updated goal object
      const updatedGoal = {
        title: newGoal.title,
        description: newGoal.description,
        tasks: validTasks,
        total: validTasks.length,
        progress: 0,
        completed: false, // Depending on the state of completion
      };

      // Update the goal in Firestore
      const goalRef = doc(firestore, `users/${userId}/goals`, editingGoalId);
      await updateDoc(goalRef, updatedGoal);

      // Update the goal in the local state
      const updatedGoals = activeGoals.map((goal) =>
        goal.id === editingGoalId ? { id: editingGoalId, ...updatedGoal } : goal
      );
      setGoals(updatedGoals);

      setEditingGoalId(null);
      setSuccessMessage("Goal updated successfully!");
    } else {
      // If we're adding a new goal
      const newGoalEntry = {
        ...newGoal,
        id: uuidv4(),
        tasks: validTasks,
        progress: 0,
        total: validTasks.length,
        completed: false,
      };

      addGoal(newGoalEntry);
      setSuccessMessage("Goal added successfully!");
    }

    setIsModalOpen(false);
    setNewGoal({ title: "", description: "", tasks: [""] });
    setTasks([""]);
    setCharCount(0);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCharCount(0);
    clearMessage();
  };

  const handleDeleteGoal = async (id: string) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    try {
      // Delete from Firestore
      const goalRef = doc(firestore, `users/${userId}/goals`, id);
      await deleteDoc(goalRef);

      // Update local state
      setGoals(activeGoals.filter((goal) => goal.id !== id));

      setSuccessMessage("Goal deleted successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (e) {
      console.error("Error deleting goal: ", e);
    }
  };

  // Edit a goal
  const handleEditGoal = (id: string) => {
    const goalToEdit = activeGoals.find((goal) => goal.id === id);
    if (goalToEdit) {
      setIsModalOpen(true);
      setNewGoal({
        title: goalToEdit.title,
        description: goalToEdit.description,
        tasks: goalToEdit.tasks,
      });
      setTasks(goalToEdit.tasks);
      setEditingGoalId(id);
    }
  };

  return (
    <div className="p-4 w-full flex-grow">
      <div
        className="text-primary cursor-pointer mb-4 text-center"
        onClick={() => {
          setIsModalOpen(true);
          setCharCount(0);
          setEditingGoalId(null);
        }}
        data-testid="add-a-goal"
      >
        + Add a goal
      </div>

      {activeGoals.map((goal) => (
        <Goal
          key={goal.id}
          goal={goal}
          onComplete={(completedTasks) => completeGoal(goal.id, completedTasks)}
          onEdit={handleEditGoal}
          onDelete={handleDeleteGoal}
          isCompleted={false}
        />
      ))}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-4 rounded-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingGoalId ? "Edit Goal" : "Add a New Goal"}
            </h3>

            {message && (
              <div className="bg-red-500 text-white text-center p-2 rounded mb-4">
                {message}
              </div>
            )}

            <input
              type="text"
              placeholder="Goal Title"
              value={newGoal.title}
              onChange={(e) => {
                setNewGoal({ ...newGoal, title: e.target.value });
                clearMessage();
              }}
              className="block w-full mb-2 p-2 bg-gray-700 text-white rounded"
            />
            <textarea
              placeholder="Your plan: How are you going to achieve this goal?"
              value={newGoal.description}
              onChange={handleDescriptionChange}
              className="block w-full mb-2 p-2 bg-gray-700 text-white rounded"
            />

            {/* Show the character count */}
            <div className="text-sm text-gray-400">
              {charCount}/{maxChars} characters
            </div>

            {/* Task Input Fields */}
            <div className="mb-4">
              {tasks.map((task, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Task ${index + 1}`}
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  className="block w-full mb-2 p-2 bg-gray-700 text-white rounded"
                />
              ))}
            </div>

            {/* Add Task Button */}
            <button className="mb-4 text-blue-500" onClick={handleAddTask}>
              + Add Task
            </button>

            {/* Action buttons */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddGoal}
              >
                {editingGoalId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivePage;
