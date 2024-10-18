import { useState, useEffect } from "react";
import { auth, storage } from "../config/firebaseconfig";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  User,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setPhotoURL(currentUser.photoURL || "");
        setEmail(currentUser.email || "");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;

    try {
      if (profileImageFile) {
        const storageRef = ref(
          storage,
          `profilePictures/${auth.currentUser.uid}/${profileImageFile.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, profileImageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => console.error("Upload error:", error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(auth.currentUser!, {
              displayName,
              photoURL: downloadURL,
            });
            setPhotoURL(downloadURL);
            alert("Profile updated successfully!");
            setUploadProgress(0);
            setProfileImageFile(null);
          }
        );
      } else {
        await updateProfile(auth.currentUser, { displayName });
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (!auth.currentUser || !currentPassword || !newPassword) return;

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      alert("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      if (error instanceof Error) {
        setPasswordChangeError(error.message);
      } else {
        setPasswordChangeError("Failed to change the password. Try again.");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#2B2D42] flex items-start justify-center p-6 pt-20 overflow-hidden">
      <div className="bg-[#8D99AE] shadow-md rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-[#EDF2F4] mb-6 text-center">
          Your Profile
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Picture */}
          <div className="text-center">
            <img
              src={photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="h-32 w-32 mx-auto rounded-full object-cover mb-4"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full mt-2">
                <div
                  className="bg-indigo-600 text-xs text-white p-0.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress.toFixed(0)}%
                </div>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#EDF2F4]">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#EDF2F4]">
                Email (read-only)
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#EDF2F4]">
            Change Password
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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

            <div>
              <label className="block text-sm font-medium text-[#EDF2F4]">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          {passwordChangeError && (
            <p className="text-red-500 text-sm mt-2">{passwordChangeError}</p>
          )}
          <button
            onClick={handlePasswordChange}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
          >
            Change Password
          </button>
        </div>

        {/* Update Profile Button */}
        <button
          onClick={handleUpdateProfile}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
