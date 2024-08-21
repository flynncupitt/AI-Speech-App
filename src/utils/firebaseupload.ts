import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseconfig"; // Import Firebase storage instance

export const uploadFileToFirebase = async (
    file: File,
    onProgress: (progress: number) => void
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress); // Call the progress callback with the current progress
        },
        (error) => {
          console.error("Upload failed:", error);
          reject(error); // Reject the promise on failure
        },
        async () => {
          // Get the download URL after the upload completes
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Resolve the promise with the download URL
        }
      );
    });
  };