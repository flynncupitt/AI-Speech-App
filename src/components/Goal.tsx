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
  };
  onComplete: () => void;
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
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(
    new Array(goal.tasks.length).fill(false)
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the 3-dot menu
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTaskCompletion = (index: number) => {
    const updatedTasks = [...completedTasks];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false); // Close the menu
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Clean up the event listener
    };
  }, [menuRef]);

  // Calculate the progress based on completed tasks
  const completedCount = completedTasks.filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / goal.total) * 100);

  return (
    <div className="flex justify-center items-start relative">
      <div className="bg-gray-800 p-4 rounded-lg mb-4 w-full max-w-[600px]">
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
                  {/* Conditionally render the Edit button only if the goal is not completed */}
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

        <p className="text-sm mb-2 break-words overflow-hidden">
          {goal.description}
        </p>

        {goal.tasks.length > 0 && (
          <div className="text-sm mb-2">
            {completedCount} / {goal.total} ({progressPercentage}%)
          </div>
        )}

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

        <div className="flex justify-between items-center">
          <button
            className={`px-3 py-1 ${
              goal.completed ? "bg-green-500" : "bg-yellow-500"
            } text-white rounded`}
            onClick={onComplete}
          >
            {goal.completed ? "Completed" : "In progress"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Goal;
