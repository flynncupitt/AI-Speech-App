import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseconfig"; // Import Firebase storage instance

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle file upload to Firebase Storage
  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        // Get the download URL after the upload completes
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        alert("File uploaded successfully!");
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Upload File
      </button>

      {uploadProgress > 0 && <p>Upload progress: {uploadProgress}%</p>}

      {downloadURL && (
        <p>
          File uploaded!{" "}
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            View file
          </a>
        </p>
      )}
    </div>
  );
};

export default FileUploader;
