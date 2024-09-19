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
  const [showDonePage, setShowDonePage] = useState(false);

  const addNewGoal = (newGoal: GoalType) => {
    setActiveGoals([...activeGoals, newGoal]);
  };

  const completeGoal = (id: string) => {
    const updatedActiveGoals = activeGoals.filter((goal) => goal.id !== id);
    const completedGoal = activeGoals.find((goal) => goal.id === id);

    if (completedGoal) {
      setCompletedGoals([
        ...completedGoals,
        { ...completedGoal, completed: true },
      ]);
      setActiveGoals(updatedActiveGoals);
    }
  };

  return (
    <div className="bg-[#18151c] w-screen text-white flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center my-4">Goal Tracker</h1>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 ${
            !showDonePage ? "bg-primary" : "bg-gray-700"
          } rounded`}
          onClick={() => setShowDonePage(false)}
        >
          In Progress
        </button>
        <button
          className={`px-4 py-2 ${
            showDonePage ? "bg-primary" : "bg-gray-700"
          } rounded`}
          onClick={() => setShowDonePage(true)}
        >
          Completed Goals
        </button>
      </div>
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
