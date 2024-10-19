import React, { useState, useEffect } from "react";
import ActivePage from "../components/ActivePage";
import DonePage from "../components/DonePage";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore, auth } from "../config/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";

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
  const [loading, setLoading] = useState(true);

  const jsConfetti = new (window as any).JSConfetti(); // JSConfetti integration

  const handleConfetti = () => {
    jsConfetti.addConfetti();
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, fetch goals
        fetchGoals(user.uid);
      } else {
        console.error("User not authenticated.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchGoals = async (userId: string) => {
    try {
      const q = query(
        collection(firestore, `users/${userId}/goals`),
        orderBy("createdAt", "asc")
      );
      const querySnapshot = await getDocs(q);

      const fetchedGoals: GoalType[] = [];
      querySnapshot.forEach((doc) => {
        fetchedGoals.push({ id: doc.id, ...doc.data() } as GoalType);
      });

      setActiveGoals(fetchedGoals.filter((goal) => !goal.completed));
      setCompletedGoals(fetchedGoals.filter((goal) => goal.completed));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching goals: ", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Display loading state while waiting for data
  }

  const addNewGoal = async (newGoal: GoalType) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const { id, ...goalWithoutId } = newGoal;

      const docRef = await addDoc(
        collection(firestore, `users/${userId}/goals`),
        {
          ...goalWithoutId,
          completed: false,
          completedTasks: new Array(newGoal.tasks.length).fill(false),
          createdAt: serverTimestamp(), // Add a timestamp
        }
      );

      setActiveGoals([...activeGoals, { id: docRef.id, ...goalWithoutId }]);
    } catch (e) {
      console.error("Error adding goal: ", e);
    }
  };

  const completeGoal = async (id: string, completedTasks: boolean[]) => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    const completedGoal = activeGoals.find((goal) => goal.id === id);

    if (completedGoal) {
      try {
        // Update Firestore
        const docRef = doc(firestore, `users/${userId}/goals`, id);
        await updateDoc(docRef, {
          completed: true,
          completedTasks,
        });

        setCompletedGoals([
          ...completedGoals,
          { ...completedGoal, completed: true, completedTasks },
        ]);
        setActiveGoals(activeGoals.filter((goal) => goal.id !== id));

        // Show confetti and motivational message
        handleConfetti();
        setMotivationalMessage(
          "🎉 Congratulations on completing your goal! 🎉"
        );
        setShowMotivationalMessage(true);
        setTimeout(() => {
          setShowMotivationalMessage(false);
        }, 3000);
      } catch (e) {
        console.error("Error completing goal: ", e);
      }
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
