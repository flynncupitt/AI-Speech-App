import React, { useState, useEffect } from "react";
import { firestore } from "../config/firebaseconfig"; // Your Firestore instance
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../config/firebaseconfig"; // Firebase auth instance
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // For redirecting and navigation

const UserRecordings: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To manage loading state
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

          const recordingsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setRecordings(recordingsList);
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

  const handleViewResults = (audioURL: string) => {
    // Pass audioURL via state when navigating
    navigate("/results", { state: { audioURL } });
  };

  if (loading) {
    return <div>Loading recordings...</div>; // Loading state
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="p-6 bg-gray-700 rounded-lg shadow-md w-full max-w-4xl mt-10">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">My Recordings</h2>
        {recordings.length > 0 ? (
          <ul>
            {recordings.map((recording) => (
              <li
                key={recording.id}
                className="mb-4 flex justify-between items-center"
              >
                {recording.filename}
              </a>{" "}
              (Uploaded on:{" "}
              {new Date(
                recording.createdAt.seconds * 1000
              ).toLocaleDateString()}
              )
              <button
                onClick={() => handleViewResults(recording.downloadURL)}
                className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Results
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No recordings found.</p>
        )}
      </div>
    </div>
  );
  
};

export default UserRecordings;
