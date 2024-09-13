import React, { useState, useEffect } from "react";
import Goal from "./Goal";

interface GoalType {
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
  completeGoal: (index: number) => void;
}

const ActivePage: React.FC<ActivePageProps> = ({
  activeGoals,
  addGoal,
  completeGoal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal for adding goal
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    tasks: [""],
  });
  const [tasks, setTasks] = useState<string[]>([""]);
  const [message, setMessage] = useState(""); // State to show error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message outside the modal

  // Clear the error message when the user starts typing or closes the modal
  const clearMessage = () => {
    setMessage("");
  };

  const handleAddTask = () => {
    setTasks([...tasks, ""]); // Add a new empty task field
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = tasks.map((task, i) => (i === index ? value : task));
    setTasks(updatedTasks); // Update tasks as user types
  };

  const handleAddGoal = () => {
    // Validate title and description
    if (newGoal.title.trim() === "" || newGoal.description.trim() === "") {
      setMessage("Error: Goal title and description cannot be empty!");
      return;
    }

    // Filter out any empty tasks
    const validTasks = tasks.filter((task) => task.trim() !== "");

    const newGoalEntry = {
      ...newGoal,
      tasks: validTasks, // Only keep tasks that are not empty
      progress: 0,
      total: validTasks.length, // Set the total to the number of valid tasks
      completed: false,
    };
    addGoal(newGoalEntry);
    setIsModalOpen(false); // Close modal after submitting
    setNewGoal({ title: "", description: "", tasks: [""] });
    setTasks([""]); // Reset tasks
    setSuccessMessage("Goal added successfully!"); // Show success message

    // Clear success message after a few seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <div className="p-4">
      {/* Success popup outside the modal */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded shadow-md z-50">
          {successMessage}
        </div>
      )}

      {/* Add Goal Button */}
      <div
        className="text-blue-500 cursor-pointer mb-4"
        onClick={() => setIsModalOpen(true)}
      >
        + Add a goal
      </div>

      {/* Display active goals */}
      {activeGoals.map((goal, index) => (
        <Goal key={index} goal={goal} onComplete={() => completeGoal(index)} />
      ))}

      {/* Modal for Adding a Goal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-4 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add a New Goal</h3>

            {/* Error message inside the modal */}
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
                clearMessage(); // Clear error message when typing
              }}
              className="block w-full mb-2 p-2 bg-gray-700 text-white rounded"
            />
            <textarea
              placeholder="Your plan: How are you going to achieve this goal?"
              value={newGoal.description}
              onChange={(e) => {
                setNewGoal({ ...newGoal, description: e.target.value });
                clearMessage(); // Clear error message when typing
              }}
              className="block w-full mb-2 p-2 bg-gray-700 text-white rounded"
            />

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
                onClick={() => {
                  setIsModalOpen(false);
                  clearMessage(); // Clear message on modal close
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddGoal}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivePage;
