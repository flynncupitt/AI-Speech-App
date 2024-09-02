import { useRef, useState } from "react";
import RecordingStopwatch from "../components/RecordingStopwatch";
import { uploadFileToFirebase } from "../utils/firebaseupload";
import { firestore } from "../config/firebaseconfig"; // Import Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebaseconfig"; // Import Firebase auth instance

export default function RecordSubmitAudioPage() {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to generate random file names
  const generateRandomFileName = (extension: string) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `recording_${randomString}_${timestamp}.${extension}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = async () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];

        const randomFileName = generateRandomFileName("webm");
        const file = new File([recordedBlob], randomFileName, {
          type: "audio/webm",
        });
        setIsLoading(true);

        try {
          const downloadURL = await uploadFileToFirebase(file, (progress) => {
            setUploadProgress(progress);
          });
          setDownloadURL(downloadURL); // Store the download URL

          // Save the recording metadata in Firestore under the user's document
          const user = auth.currentUser; // Get the currently logged-in user
          if (user) {
            const recordingsRef = collection(
              firestore,
              "users",
              user.uid,
              "recordings"
            );
            await addDoc(recordingsRef, {
              downloadURL: downloadURL,
              filename: randomFileName,
              createdAt: serverTimestamp(),
              size: file.size,
              contentType: file.type,
            });
            alert("File uploaded and metadata saved successfully!");
            console.log("Uploaded file available at:", downloadURL);
          } else {
            console.error("No user is currently logged in.");
            alert("You must be logged in to save recordings.");
          }
        } catch (error) {
          console.error("File upload failed:", error);
          alert("Upload failed, please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <p className="flex-grow text-xl">My chosen prompt</p>
      <div className="flex-grow">
        <audio controls src={recordedUrl} />
      </div>
      {isRecording && (
        <RecordingStopwatch isRunning={isRecording}></RecordingStopwatch>
      )}
      <div className="flex flex-grow items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <button
            className={`bg-purple-600 ${isRecording ? "h-10" : "h-16"} ${
              isRecording ? "w-10" : "w-16"
            } ${
              isRecording ? "rounded-lg" : "rounded-full"
            } focus:outline-none`}
            onClick={() => {
              isRecording ? stopRecording() : startRecording();
              setIsRecording(!isRecording);
            }}
          ></button>
          <div className="absolute w-full h-full border-4 border-zinc-700 rounded-full transform scale-100 pointer-events-none"></div>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid border-l-4 border-l-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Display Progress */}
      {uploadProgress > 0 && !isLoading && (
        <p className="mt-4">Upload progress: {uploadProgress}%</p>
      )}
    </div>
  );
}
