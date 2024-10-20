import { useState, useEffect } from "react";
import { firestore } from "../config/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../config/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const [recordingsCount, setRecordingsCount] = useState<number>(0);
  const [, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const recordingsRef = collection(
            firestore,
            "users",
            user.uid,
            "recordings"
          );
          const snapshot = await getDocs(recordingsRef);

          // Set the count of recordings
          setRecordingsCount(snapshot.docs.length);
        } catch (error) {
          console.error("Error fetching recordings:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user is logged in.");
        navigate("/signin"); // Redirect to sign-in page if no user is logged in
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-indigo-600">Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md w-full text-center mb-4">
        <p className="text-xl font-semibold text-gray-700">
          Recordings Score <span className="text-yellow-500">⭐️</span>:
        </p>
        <p className="text-4xl font-bold text-green-600 mt-2">
          {recordingsCount}
        </p>
      </div>

      <a
        href="/recordings"
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-500 transition duration-300"
      >
        View My Recordings
      </a>
    </div>
  );
};

export default UserDashboard;
