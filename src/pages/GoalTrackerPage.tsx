import React, { useState } from "react";
import ActivePage from "../components/ActivePage";
import DonePage from "../components/DonePage";

interface GoalType {
  title: string;
  description: string;
  progress: number;
  total: number;
  tasks: string[];
  completed: boolean;
}

const GoalTrackerPage: React.FC = () => {
  const [showDonePage, setShowDonePage] = useState(false); // Toggle between active and done goals
  const [goals, setGoals] = useState<GoalType[]>([]); // All goals are stored here

  const addNewGoal = (newGoal: GoalType) => {
    setGoals([...goals, newGoal]);
  };

  const completeGoal = (index: number) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, completed: true } : goal
    );
    setGoals(updatedGoals);
  };

  const activeGoals = goals.filter((goal) => !goal.completed); // Active (In progress) goals
  const doneGoals = goals.filter((goal) => goal.completed); // Completed goals

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center">
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
      <div className="w-full max-w-4xl p-4">
        {showDonePage ? (
          <DonePage doneGoals={doneGoals} />
        ) : (
          <ActivePage
            activeGoals={activeGoals}
            addGoal={addNewGoal}
            completeGoal={completeGoal}
          />
        )}
      </div>
    </div>
  );
};

export default GoalTrackerPage;
