import React, { useState } from "react";

interface GoalProps {
  goal: {
    title: string;
    description: string;
    progress: number;
    total: number;
    tasks: string[];
    completed: boolean;
  };
  onComplete: () => void;
}

const Goal: React.FC<GoalProps> = ({ goal, onComplete }) => {
  const [completedTasks, setCompletedTasks] = useState<boolean[]>(
    new Array(goal.tasks.length).fill(false)
  );

  const handleTaskCompletion = (index: number) => {
    const updatedTasks = [...completedTasks];
    updatedTasks[index] = !updatedTasks[index];
    setCompletedTasks(updatedTasks);
  };

  // Calculate the progress based on completed tasks
  const completedCount = completedTasks.filter(Boolean).length;
  const progressPercentage = Math.round((completedCount / goal.total) * 100);

  return (
    <div className="flex justify-center items-start">
      {" "}
      {/* Removed min-h-screen */}
      <div className="bg-gray-800 p-4 rounded-lg mb-4 w-full max-w-[600px]">
        <h2 className="text-xl font-bold mb-2 break-words">{goal.title}</h2>
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
