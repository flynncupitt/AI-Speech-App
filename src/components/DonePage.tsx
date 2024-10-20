import React from "react";
import Goal from "./Goal";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "../config/firebaseconfig";

// Define the type for goal object
interface GoalType {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  tasks: string[];
  completed: boolean;
}

// Define the props
interface DonePageProps {
  doneGoals: GoalType[]; // Array for completed goals
  setGoals: (goals: GoalType[]) => void; // Function to update goals
  setSuccessMessage: (message: string | null) => void; // Displaying success message
}

// DonePage component that lists completed goals
const DonePage: React.FC<DonePageProps> = ({
  doneGoals,
  setGoals,
  setSuccessMessage,
}) => {
  // This function handles the deletion of a completed goal
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
        doneGoals.map((goal) => (
          <Goal
            key={goal.id} // Unique key for each
            goal={goal} // Pass the goal to the goal component
            onComplete={() => {}}
            onEdit={() => {}}
            onDelete={handleDeleteCompletedGoal} // Use the delete handler
            isCompleted={true} // Indicate that this goal is completed
          />
        ))
      ) : (
        // Display message if there is no goals are present
        <p className="text-center">No completed goals yet.</p>
      )}
    </div>
  );
};

export default DonePage;
