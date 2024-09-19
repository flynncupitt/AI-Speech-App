import React from "react";
import Goal from "./Goal";

interface GoalType {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  tasks: string[];
  completed: boolean;
}

interface DonePageProps {
  doneGoals: GoalType[];
  setGoals: (goals: GoalType[]) => void;
  setSuccessMessage: (message: string | null) => void;
}

const DonePage: React.FC<DonePageProps> = ({
  doneGoals,
  setGoals,
  setSuccessMessage,
}) => {
  const handleDeleteCompletedGoal = (id: string) => {
    setGoals(doneGoals.filter((goal) => goal.id !== id));

    // Show the success message
    setSuccessMessage("Completed goal deleted successfully!");

    // Hide the message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  return (
    <div className="p-4 w-full flex-grow">
      {doneGoals.length > 0 ? (
        doneGoals.map((goal, index) => (
          <Goal
            key={goal.id}
            goal={goal}
            onComplete={() => {}}
            onEdit={() => {}}
            onDelete={handleDeleteCompletedGoal} // Use the delete handler
            isCompleted={true}
          />
        ))
      ) : (
        <p className="text-center">No completed goals yet.</p>
      )}
    </div>
  );
};

export default DonePage;
