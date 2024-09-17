import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../config/firebaseconfig";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";

const RecordingsPage: React.FC = () => {
  const [username, setUsername] = useState<string>("Loading...");
  const [recordings, setRecordings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
      } else {
        console.log("User is signed in:", user);

        const displayName = user.displayName || user.email || "Unknown User";
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
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center min-h-screen">
        Loading recordings...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-between min-h-screen p-6 md:p-8 lg:p-12">
      {/* Header */}
      <header className="w-full flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 lg:mb-8">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
          <span className="text-lg md:text-xl lg:text-2xl">{username}</span>
        </div>
        <div className="relative flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-orange-500 text-sm md:text-base lg:text-lg">
              🔥
            </span>
            <span className="text-sm md:text-base lg:text-lg">5</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-purple-500 text-sm md:text-base lg:text-lg">
              🏆
            </span>
            <span className="text-sm md:text-base lg:text-lg">30</span>
          </div>
          <div
            className="space-y-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-8 h-1 bg-purple-500"></div>
            <div className="w-8 h-1 bg-purple-500"></div>
            <div className="w-8 h-1 bg-purple-500"></div>
          </div>
          {/* Hamburger Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-50">
              <button
                onClick={() => navigate("/settings")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
              >
                Settings
              </button>
              <button
                onClick={() => navigate("/history")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex justify-around w-full mt-4 md:mt-6 lg:mt-8">
        <a href="#" className="text-gray-500 text-sm md:text-base lg:text-lg">
          Notifications
        </a>
        <a
          href="#"
          className="text-purple-500 border-b-2 border-purple-500 text-sm md:text-base lg:text-lg"
        >
          My Recordings
        </a>
        <a href="#" className="text-gray-500 text-sm md:text-base lg:text-lg">
          Leaderboard
        </a>
      </nav>

      {/* List of Recordings */}
      <section className="w-full flex-1 mt-6 md:mt-8 lg:mt-10 overflow-y-auto">
        {recordings.length > 0 ? (
          <ul className="space-y-4">
            {recordings.map((recording) => (
              <li
                key={recording.id}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div>
                  <span className="block text-lg md:text-xl lg:text-2xl">
                    {recording.filename}
                  </span>
                  <span className="block text-gray-500 text-sm md:text-base lg:text-lg">
                    {new Date(
                      recording.createdAt.seconds * 1000
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <audio
                    controls
                    src={recording.downloadURL}
                    className="w-full max-w-xs"
                  ></audio>
                  <button className="bg-gray-700 p-2 rounded-full">•••</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm md:text-base lg:text-lg">
            No recordings found.
          </p>
        )}
      </section>

      {/* Fixed Bottom Record Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => navigate("/record")}
          className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-2xl md:text-3xl lg:text-4xl">●</span>
        </button>
      </div>
    </div>
  );
};

export default RecordingsPage;
