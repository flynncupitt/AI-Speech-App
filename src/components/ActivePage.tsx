import React, { useState } from "react";
import Goal from "./Goal";
import { v4 as uuidv4 } from "uuid";

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
  completeGoal: (id: string) => void;
  setGoals: (goals: GoalType[]) => void;
}

const ActivePage: React.FC<ActivePageProps> = ({
  activeGoals,
  addGoal,
  completeGoal,
  setGoals,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    tasks: [""],
  });
  const [tasks, setTasks] = useState<string[]>([""]);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

  const handleAddGoal = () => {
    if (newGoal.title.trim() === "" || newGoal.description.trim() === "") {
      setMessage("Error: Goal title and description cannot be empty!");
      return;
    }

    const validTasks = tasks.filter((task) => task.trim() !== "");

    if (editingGoalId) {
      const updatedGoals = activeGoals.map((goal) =>
        goal.id === editingGoalId
          ? {
              ...goal,
              title: newGoal.title,
              description: newGoal.description,
              tasks: validTasks,
              total: validTasks.length,
            }
          : goal
      );
      setGoals(updatedGoals);
      setEditingGoalId(null);
      setSuccessMessage("Goal updated successfully!");
    } else {
      const newGoalEntry = {
        id: uuidv4(),
        ...newGoal,
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
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded shadow-md z-50">
          {successMessage}
        </div>
      )}
      <div
        className="text-primary cursor-pointer mb-4 text-center"
        onClick={() => {
          setIsModalOpen(true);
          setCharCount(0);
          setEditingGoalId(null);
        }}
      >
        + Add a goal
      </div>

      {activeGoals.map((goal) => (
        <Goal
          key={goal.id}
          goal={goal}
          onComplete={() => completeGoal(goal.id)}
          onEdit={handleEditGoal}
          onDelete={(id) =>
            setGoals(activeGoals.filter((goal) => goal.id !== id))
          }
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
