import React, { useState, useEffect, useRef } from "react";

interface GoalProps {
  goal: {
    id: string;
    title: string;
    description: string;
    progress: number;
    total: number;
    tasks: string[];
    completed: boolean;
    completedTasks?: boolean[];
  };
  onComplete: (completedTasks: boolean[]) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isCompleted: boolean;
}

const Goal: React.FC<GoalProps> = ({
  goal,
  onComplete,
  onEdit,
  onDelete,
  isCompleted,
}) => {
  // Track which tasks are completed for this goal
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(
    goal.completedTasks || new Array(goal.tasks.length).fill(false)
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false); //toggle the 3-dot menu
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message
  const menuRef = useRef<HTMLDivElement>(null); // Detect clicks outside of the 3-dot menu to close it

  // Handle task completion toggle
  const handleTaskCompletion = (index: number) => {
    const updatedTasks = [...completedTasks]; // Copy the tasks
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks); // Update the state with the new task completion status
  };

  // Close the 3-dot menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false); //Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // Calculate the number of completed tasks
  const completedCount = completedTasks.filter(Boolean).length;

  // Calculate the percentage of completed tasks
  const progressPercentage = Math.round((completedCount / goal.total) * 100);

  // Check if all tasks are completed
  const areAllTasksCompleted = completedTasks.every((task) => task);

  // Check if all tasks are done so the goal can be marked as complete
  const handleCompleteClick = () => {
    if (goal.tasks.length > 0 && !areAllTasksCompleted) {
      // If there are tasks and not all tasks are completed, show an error
      setErrorMessage(
        "Please complete all tasks before marking the goal as completed."
      );
      return;
    }

    setErrorMessage(null);
    onComplete(completedTasks);
  };

  return (
    <div className="flex justify-center items-start relative">
      <div className="bg-navBar p-4 rounded-lg mb-4 w-full max-w-[600px]">
        {/* Title and 3-dot menu */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold mb-2 break-words truncate max-w-full">
            {goal.title}
          </h2>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 focus:outline-none"
            >
              &#x2022;&#x2022;&#x2022; {/* This is the 3-dot button */}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg">
                <ul>
                  {!isCompleted && (
                    <li
                      className="px-4 py-2 text-gray-300 hover:bg-gray-600 cursor-pointer"
                      onClick={() => onEdit(goal.id)}
                    >
                      Edit
                    </li>
                  )}
                  <li
                    className="px-4 py-2 text-red-400 hover:bg-gray-600 cursor-pointer"
                    onClick={() => onDelete(goal.id)}
                  >
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Goal description */}
        <p className="text-sm mb-2 break-words overflow-hidden">
          {goal.description}
        </p>

        {/* Display task progress count */}
        {goal.tasks.length > 0 && (
          <div className="text-sm mb-2">
            {completedCount} / {goal.total} ({progressPercentage}%)
          </div>
        )}

        {/* Display task list with checkboxes */}
        {goal.tasks.length > 0 && (
          <div className="mb-2">
            {goal.tasks.map((task, index) => (
              <div key={index} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={completedTasks[index]}
                  onChange={() => handleTaskCompletion(index)}
                  className="mr-2 mt-1"
                />
                <span className="break-words w-full text-left">{task}</span>
              </div>
            ))}
          </div>
        )}

        {/* Display error message if present */}
        {errorMessage && (
          <div className="text-red-500 mb-2">{errorMessage}</div>
        )}

        {/* Completion button */}
        <div className="flex justify-between items-center">
          <button
            className={`px-3 py-1 ${
              goal.completed ? "bg-green-500" : "bg-yellow-500"
            } text-white rounded`}
            onClick={handleCompleteClick} // Update the completion button
          >
            {goal.completed ? "Completed" : "In progress"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Goal;
