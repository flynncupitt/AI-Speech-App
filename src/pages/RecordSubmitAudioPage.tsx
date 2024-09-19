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
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  // Separate lists for short, medium, and long prompts
  const shortPrompts = [
    "The sun set behind the mountains, casting a golden glow over the valley.",
    "A gentle breeze carried the scent of blooming flowers through the air.",
    "The forest floor was soft underfoot, covered in a thick carpet of moss."
  ];

  const mediumPrompts = [
    "The ancient tree stood tall in the clearing, its roots deep and its branches wide. Birds nested high above, chirping a melody that filled the serene forest.",
    "The ocean waves crashed rhythmically against the shore, their sound soothing to the onlookers. A distant lighthouse blinked, guiding ships through the evening fog.",
    "The morning fog hung low over the hills, creating a mystical atmosphere. As the sun slowly rose, its light pierced through, illuminating the landscape in a soft glow."
  ];

  const longPrompts = [
    "As the storm raged outside, the small cabin offered a haven of warmth and comfort. Inside, a fire crackled in the hearth, casting dancing shadows on the walls. The family gathered around the table, sharing stories of the day, the storm's howling winds a mere backdrop to their laughter.",
    "The bustling city streets were alive with energy as people hurried to their destinations. Street vendors called out, offering their goods, while musicians played for the crowds. Amidst the chaos, a single figure stood still, observing the flow of life with quiet contemplation, as the city pulsed with its unrelenting rhythm.",
    "In the heart of the ancient castle, a grand banquet was taking place. The long table was filled with delicacies from distant lands, and the air was filled with the scent of roasted meats and freshly baked bread. Musicians played lively tunes, while nobles and common folk alike mingled and danced, forgetting for a moment the troubles that awaited them beyond the castle walls.",
    "The expedition had been traveling for weeks, trekking through dense jungles and across treacherous mountains. At last, they reached their destination: a forgotten temple hidden deep within the wilderness. Vines and moss covered the ancient stone structure, but its grandeur was unmistakable. As they stepped inside, torches flickering in the dark, they knew they were on the brink of uncovering secrets lost to time."
  ];

  // Function to generate random file names
  const generateRandomFileName = (extension: string) => {
    const randomString = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now();
    return `recording_${randomString}_${timestamp}.${extension}`;
  };

  // Function to handle generating a random prompt based on type
  const generateRandomPrompt = (type: "short" | "medium" | "long") => {
    let selectedList: string[] = [];
    if (type === "short") {
      selectedList = shortPrompts;
    } else if (type === "medium") {
      selectedList = mediumPrompts;
    } else if (type === "long") {
      selectedList = longPrompts;
    }

    const randomPrompt =
      selectedList[Math.floor(Math.random() * selectedList.length)];
    setSelectedPrompt(randomPrompt);
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
    <div className="flex flex-col h-[90vh] items-center justify-center">
      <p className="text-xl">Select prompt type</p>

      {/* Buttons to choose prompt type */}
      <div className="mb-4 flex space-x-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => generateRandomPrompt("short")}
        >
          Short
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => generateRandomPrompt("medium")}
        >
          Medium
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => generateRandomPrompt("long")}
        >
          Long
        </button>
      </div>

      {/* Display selected prompt in a container */}
      <div className="bg-white shadow-md rounded-lg p-4 max-w-lg text-center">
        {selectedPrompt ? (
          <p className="text-lg font-semibold text-gray-700">{selectedPrompt}</p>
        ) : (
          <p className="text-gray-500">Select a prompt to begin</p>
        )}
      </div>

      <div className="flex-grow">
        <audio controls src={recordedUrl} />
      </div>
      {isRecording && (
        <RecordingStopwatch isRunning={isRecording}></RecordingStopwatch>
      )}
      <div className="flex flex-grow items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <button
            className={`bg-primary ${isRecording ? "h-10" : "h-16"} ${
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