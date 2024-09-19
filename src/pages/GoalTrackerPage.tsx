import React, { useState } from "react";
import ActivePage from "../components/ActivePage";
import DonePage from "../components/DonePage";

interface GoalType {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  tasks: string[];
  completed: boolean;
}

const GoalTrackerPage: React.FC = () => {
  const [activeGoals, setActiveGoals] = useState<GoalType[]>([]);
  const [completedGoals, setCompletedGoals] = useState<GoalType[]>([]);
  const [showDonePage, setShowDonePage] = useState(false); // Toggle between active and done goals

  // Function to add a new goal to the active goals list
  const addNewGoal = (newGoal: GoalType) => {
    setActiveGoals([...activeGoals, newGoal]);
  };

  // Function to mark a goal as complete and move it to completed goals
  const completeGoal = (id: string) => {
    const updatedActiveGoals = activeGoals.filter((goal) => goal.id !== id); // Remove the goal from active
    const completedGoal = activeGoals.find((goal) => goal.id === id); // Find the completed goal

    if (completedGoal) {
      // Move the completed goal to the completed goals state
      setCompletedGoals([
        ...completedGoals,
        { ...completedGoal, completed: true },
      ]);
      setActiveGoals(updatedActiveGoals); // Update active goals without the completed goal
    }
  };

  return (
    <div className="bg-gray-900 w-screen text-white flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center my-4">Goal Tracker</h1>
      {/* Toggle between Active and Completed goals */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 ${
            !showDonePage ? "bg-blue-500" : "bg-gray-700"
          } rounded`}
          onClick={() => setShowDonePage(false)}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-2 ${
            showDonePage ? "bg-blue-500" : "bg-gray-700"
          } rounded`}
          onClick={() => setShowDonePage(true)}
        >
          Completed Goals
        </button>
      </div>
      {/* Conditionally render ActivePage or DonePage based on the toggle */}
      <div className="w-full max-w-full p-4 flex-grow">
        {showDonePage ? (
          <DonePage doneGoals={completedGoals} setGoals={setCompletedGoals} />
        ) : (
          <ActivePage
            activeGoals={activeGoals}
            addGoal={addNewGoal}
            completeGoal={completeGoal}
            setGoals={setActiveGoals}
          />
        )}
      </div>
    </div>
  );
};

export default GoalTrackerPage;
