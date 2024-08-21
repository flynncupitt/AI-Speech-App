import React, { useState } from "react";
import { uploadFileToFirebase } from "../utils/firebaseupload"; // Import the function

const SomePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

    try {
      const url = await uploadFileToFirebase(file, (progress) => {
        setUploadProgress(progress); // Update progress state
      });
      setDownloadURL(url); // Store the download URL
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("File upload failed:", error);
    }
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

export default SomePage;
