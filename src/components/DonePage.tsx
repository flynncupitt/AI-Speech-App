import React from "react";
import Goal from "./Goal";

interface GoalType {
  title: string;
  description: string;
  progress: number;
  total: number;
  tasks: string[];
  completed: boolean;
}

interface DonePageProps {
  doneGoals: GoalType[];
}

const DonePage: React.FC<DonePageProps> = ({ doneGoals }) => {
  return (
    <div className="p-4">
      {doneGoals.length > 0 ? (
        doneGoals.map((goal, index) => (
          <Goal key={index} goal={goal} onComplete={() => {}} />
        ))
      ) : (
        <p className="text-center">No completed goals yet.</p>
      )}
    </div>
  );
};

export default DonePage;
