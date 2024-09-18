import { useState, useEffect } from "react";
import { auth, storage } from "../config/firebaseconfig";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import necessary Firebase Storage functions

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  const handleUpdateProfile = () => {
    if (!auth.currentUser) return;

    if (profileImageFile) {
      const storageRef = ref(
        storage,
        `profilePictures/${auth.currentUser.uid}/${profileImageFile.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, profileImageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress function
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Error function
          console.error("Upload error:", error);
        },
        () => {
          // Complete function
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProfile(auth.currentUser!, {
              displayName,
              photoURL: downloadURL,
            })
              .then(() => {
                setPhotoURL(downloadURL);
                alert("Profile updated successfully!");
                setUploadProgress(0);
                setProfileImageFile(null);
              })
              .catch((error) => {
                console.error("Error updating profile:", error);
              });
          });
        }
      );
    } else {
      // If no new image is selected, just update the display name
      updateProfile(auth.currentUser, {
        displayName,
      })
        .then(() => {
          alert("Profile updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating profile:", error);
        });
    }
  };

  if (!user) return null; // or a loading indicator

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="flex flex-col space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email (read-only)
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="flex items-center space-x-4">
            <img
              src={photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {/* Show upload progress if uploading */}
          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full mt-2">
              <div
                className="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress.toFixed(0)}%
              </div>
            </div>
          )}
        </div>

        {/* Update Button */}
        <button
          onClick={handleUpdateProfile}
          className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}
