import React from "react";
import Goal from "./Goal";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "../config/firebaseconfig";

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
  const handleDeleteCompletedGoal = async (id: string) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    try {
      console.log("Deleting goal with ID:", id);

      const goalRef = doc(firestore, `users/${userId}/goals`, id);

      await deleteDoc(goalRef);

      setGoals(doneGoals.filter((goal) => goal.id !== id));

      setSuccessMessage("Completed goal deleted successfully!");

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error deleting goal: ", error);
    }
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
