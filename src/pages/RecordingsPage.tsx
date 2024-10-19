import React, { useState, useEffect } from "react";
import { firestore } from "../config/firebaseconfig"; // Your Firestore instance
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../config/firebaseconfig"; // Firebase auth instance
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // For redirecting and navigation
import ShareResults from '../components/ShareResults.tsx';

const UserRecordings: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To manage loading state
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {

        const displayName = user.displayName || user.email;
        setUsername(displayName);

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
    <div className="p-4">
      <h2 className="text-2xl mb-4">My Recordings</h2>
      <ul>
        {recordings.length > 0 ? (
          recordings.map((recording) => (
            <li key={recording.id} className="mb-2">
              <a
                href={recording.downloadURL}
                target="_blank"
                rel="noopener noreferrer"
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
              <ShareResults
                username={username ?? "Unknown User"}
                filename={recording.filename}
                mumbledWords={3}
                fillerWords={2}
                stats={0}
                wordsPerMinute={150}
              />
            </li>
          ))
        ) : (
          <p>No recordings found.</p>
        )}
      </ul>
    </div>
  );
};




export default UserRecordings;
