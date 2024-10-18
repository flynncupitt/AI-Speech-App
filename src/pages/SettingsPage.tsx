import { useState, useEffect } from "react";
import { auth } from "../config/firebaseconfig";
import {
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !currentPassword) return;

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );

      // Re-authenticate the user
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete the user account
      await deleteUser(auth.currentUser);
      alert("Account deleted successfully.");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Failed to delete the account. Try again.");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen bg-[#2B2D42] flex items-start justify-center p-6 pt-20">
      <div className="bg-[#8D99AE] shadow-md rounded-lg w-full max-w-2xl p-8">
        <h1 className="text-3xl font-bold text-[#EDF2F4] mb-6 text-center">
          Account Settings
        </h1>

        <div className="space-y-6">
          {/* Delete Account Section */}
          <div className="border-t border-gray-300 pt-6">
            <h2 className="text-xl font-semibold text-[#EDF2F4] mb-2">
              Delete Account
            </h2>
            <p className="text-[#EDF2F4] mb-4">
              To delete your account, please confirm your current password.
            </p>
            <div>
              <label className="block text-sm font-medium text-[#EDF2F4]">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            {deleteError && (
              <p className="text-red-500 text-sm mt-2">{deleteError}</p>
            )}
            <button
              onClick={handleDeleteAccount}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
