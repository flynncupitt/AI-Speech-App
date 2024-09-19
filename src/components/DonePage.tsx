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
}

const DonePage: React.FC<DonePageProps> = ({ doneGoals, setGoals }) => {
  return (
    <div className="p-4 w-full flex-grow">
      {doneGoals.length > 0 ? (
        doneGoals.map((goal, index) => (
          <Goal
            key={goal.id}
            goal={goal}
            onComplete={() => {}} // Placeholder, no need for onComplete in DonePage
            onEdit={() => {}} // No edit functionality for completed goals
            onDelete={(id) =>
              setGoals(doneGoals.filter((goal) => goal.id !== id))
            }
            isCompleted={true} // Completed goals, so no Edit button
          />
        ))
      ) : (
        <p className="text-center">No completed goals yet.</p>
      )}
    </div>
  );
};

export default DonePage;
