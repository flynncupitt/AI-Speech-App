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
  completedTasks?: boolean[];
}

const GoalTrackerPage: React.FC = () => {
  const [activeGoals, setActiveGoals] = useState<GoalType[]>([]);
  const [completedGoals, setCompletedGoals] = useState<GoalType[]>([]);
  const [showDonePage, setShowDonePage] = useState(false);
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const jsConfetti = new (window as any).JSConfetti(); // JSConfetti integration

  const handleConfetti = () => {
    jsConfetti.addConfetti();
  };

  const addNewGoal = (newGoal: GoalType) => {
    setActiveGoals([...activeGoals, newGoal]);
  };

  const completeGoal = (id: string, completedTasks: boolean[]) => {
    const updatedActiveGoals = activeGoals.filter((goal) => goal.id !== id);
    const completedGoal = activeGoals.find((goal) => goal.id === id);

    if (completedGoal) {
      setCompletedGoals([
        ...completedGoals,
        { ...completedGoal, completed: true, completedTasks }, // Pass completedTasks here
      ]);
      setActiveGoals(updatedActiveGoals);

      //Trigger the confetti
      handleConfetti();

      // shows the motivational message
      setMotivationalMessage("🎉 Congratulations on completing your goal! 🎉");
      setShowMotivationalMessage(true);

      setTimeout(() => {
        setShowMotivationalMessage(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-[#18151c] w-screen text-white flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center my-4">Goal Tracker</h1>

      {/*Display the motivational message */}
      {showMotivationalMessage && (
        <div className="fixed top-20 bg-green-500 text-white p-4 rounded-md shadow-md pop-up">
          <h2 className="text-2xl font-semibold">{motivationalMessage}</h2>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white p-2 rounded shadow-md z-50">
          {successMessage}
        </div>
      )}
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
          <DonePage
            doneGoals={completedGoals}
            setGoals={setCompletedGoals}
            setSuccessMessage={setSuccessMessage}
          />
        ) : (
          <ActivePage
            activeGoals={activeGoals}
            addGoal={addNewGoal}
            completeGoal={completeGoal}
            setGoals={setActiveGoals}
            setSuccessMessage={setSuccessMessage}
          />
        )}
      </div>
    </div>
  );
};

export default GoalTrackerPage;
