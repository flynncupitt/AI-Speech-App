import React, { useState, useEffect } from "react";
import { firestore } from "../config/firebaseconfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, storage } from "../config/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import ShareResults from "../components/ShareResults.tsx";

const UserRecordings: React.FC = () => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null); // New state for username
  const navigate = useNavigate();

  // useEffect for it to listens for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const displayName = user.displayName || user.email;
        setUsername(displayName); // Set the username

        try {
          // Recordings collection of the logged in user in Firestore
          const recordingsRef = collection(
            firestore,
            "users",
            user.uid,
            "recordings"
          );
          const snapshot = await getDocs(recordingsRef);

          const recordingsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            favorite: false,
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
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Function to toggle favourite status of a recording
  const toggleFavorite = async (recordingId: string, isFavorite: boolean) => {
    try {
      const recordingRef = doc(
        firestore,
        "users",
        auth.currentUser!.uid,
        "recordings",
        recordingId
      );
      // Update the favourite status in Firestore
      await updateDoc(recordingRef, { favorite: !isFavorite });

      setRecordings((prevRecordings) =>
        prevRecordings.map((recording) =>
          recording.id === recordingId
            ? { ...recording, favorite: !isFavorite }
            : recording
        )
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Function to delete a recording from both Firestore and Firesbase storage
  const deleteRecording = async (recordingId: string, fileUrl: string) => {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

      const recordingDocRef = doc(
        firestore,
        "users",
        auth.currentUser!.uid,
        "recordings",
        recordingId
      );
      await deleteDoc(recordingDocRef);

      // Remove the recording from state
      setRecordings((prevRecordings) =>
        prevRecordings.filter((recording) => recording.id !== recordingId)
      );

      alert("Recording deleted successfully!");
    } catch (error) {
      console.error("Error deleting recording:", error);
      alert("Failed to delete recording. Please try again.");
    }
  };

  // Function to handle navigation to results page
  const handleViewResults = (audioURL: string) => {
    // Pass audioURL via state when navigating
    navigate("/results", { state: { audioURL } });
  };

  if (loading) {
    return <div>Loading recordings...</div>;
  }

  const filteredRecordings = showFavorites
    ? recordings.filter((recording) => recording.favorite)
    : recordings;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4 text-center">My Recordings</h2>

      <button
        className="mb-4 bg-blue-500 text-white px-3 py-2 rounded w-full sm:w-auto mx-auto"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        {showFavorites ? "Show All Recordings" : "Show Favorites"}
      </button>

      <ul className="space-y-4">
        {filteredRecordings.length > 0 ? (
          filteredRecordings.map((recording) => (
            <li
              key={recording.id}
              className="bg-gray-900 p-4 rounded-lg text-center"
            >
              <div>
                <a
                  href={recording.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm sm:text-base block"
                >
                  {recording.filename}
                </a>
              </div>

              <div className="mt-2 text-gray-500 text-xs sm:text-sm">
                Uploaded on:{" "}
                {new Date(
                  recording.createdAt.seconds * 1000
                ).toLocaleDateString()}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-center gap-2 mt-3">
                {/* View result button */}
                <button
                  onClick={() => handleViewResults(recording.downloadURL)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                  View Results
                </button>

                {/* Favourite button */}
                <button
                  onClick={() =>
                    toggleFavorite(recording.id, recording.favorite)
                  }
                  className={`${
                    recording.favorite
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  } text-white font-semibold px-4 py-2 rounded-md transition duration-200`}
                >
                  {recording.favorite ? "Unmark Favorite" : "Mark as Favorite"}
                </button>

                {/* Delete button */}
                <button
                  onClick={() =>
                    deleteRecording(recording.id, recording.downloadURL)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                  Delete
                </button>

                {/* ShareResults component */}
                <ShareResults
                  username={username ?? "Unknown User"}
                  filename={recording.filename}
                  mumbledWords={3} // Replace with actual data if available
                  fillerWords={2} // Replace with actual data if available
                  stats={0} // Replace with actual data if available
                  wordsPerMinute={150} // Replace with actual data if available
                />
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400">No recordings found.</p>
        )}
      </ul>
    </div>
  );
};

export default UserRecordings;
