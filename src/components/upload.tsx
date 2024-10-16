import React, { useState } from "react";
import { uploadFileToFirebase } from "../utils/firebaseupload"; // Import the function

const SomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    // Start loading
    setIsLoading(true);
    console.log("Uploading started, spinner should show now");

    try {
      const url = await uploadFileToFirebase(file, (progress) => {
        setUploadProgress(progress); // Update progress state
      });
      setDownloadURL(url); // Store the download URL
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      // Stop loading
      setIsLoading(false);
      console.log("Uploading finished, spinner should stop now");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <input
        data-testid="file-input"
        type="file"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Upload File
      </button>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-l-4 border-l-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Display Progress */}
      {uploadProgress > 0 && !isLoading && (
        <p className="mt-4">Upload progress: {uploadProgress}%</p>
      )}

      {/* Display Download URL */}
      {downloadURL && (
        <p className="mt-4">
          File uploaded!{" "}
          <a href={downloadURL} target="_blank" rel="noopener noreferrer">
            View file
          </a>
        </p>
      )}
    </div>
  );
};

export default SomePage;
