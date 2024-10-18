import { useRef, useState } from "react";
import RecordingStopwatch from "../components/RecordingStopwatch";
import { uploadFileToFirebase } from "../utils/firebaseupload";
import { firestore } from "../config/firebaseconfig"; // Import Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../config/firebaseconfig"; // Import Firebase auth instance
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function RecordSubmitAudioPage() {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [] = useState<File | null>(null);
  const [, setDownloadURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHighlightText, setShowHighlightText] = useState<boolean>(false);
  const [showTranscriptArea, setShowTranscriptArea] = useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const fillerWords = [
    "um",
    "uh",
    "like",
    "so",
    "but",
    "oh",
    "basically",
    "well",
    "you know",
  ];
  const [highlightedText, setHighlightedText] = useState<JSX.Element | null>(
    null
  );

  const highlightFillerWords = (text: string): JSX.Element => {
    const words = text.split(" ");
    return (
      <span>
        {words.map((word, index) => {
          const isFiller = fillerWords.includes(word.toLowerCase());
          return (
            <span key={index} className={isFiller ? "bg-red-500" : ""}>
              {word}{" "}
            </span>
          );
        })}
      </span>
    );
  };

  // Separate lists for short, medium, and long prompts
  const shortPrompts = [
    "The power of a smile in daily interactions",
    "Why morning routines set the tone for the day",
    "The impact of gratitude on mental health",
  ];

  const mediumPrompts = [
    "The role of social media in shaping modern communication",
    "How small habits lead to big changes",
    "The importance of environmental conservation in urban areas",
  ];

  const longPrompts = [
    "The future of renewable energy and its global implications",
    "The evolution of education in a digital world",
    "The psychological effects of working from home in a post-pandemic era",
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

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
    setShowTranscriptArea(true);
    resetTranscript();
    setShowHighlightText(false);
    SpeechRecognition.startListening({ continuous: true });
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
    SpeechRecognition.stopListening();
    setShowHighlightText(true);
    setHighlightedText(highlightFillerWords(transcript));
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

      <div className="bg-white shadow-md rounded-lg p-4 max-w-lg text-center">
        {selectedPrompt ? (
          <p className="text-lg font-semibold text-gray-700">
            {selectedPrompt}
          </p>
        ) : (
          <p className="text-gray-500">Select a prompt to begin</p>
        )}
      </div>

      <div className="flex-grow pt-4">
        <audio controls src={recordedUrl} />
      </div>
      {isRecording && (
        <RecordingStopwatch isRunning={isRecording}></RecordingStopwatch>
      )}
      {showTranscriptArea && (
        <div className="flex flex-col items-center w-[90%] md:w-1/2 box-border">
          <p>Your transcription</p>
          <div className=" bg-navBar rounded-lg p-4">
            <p>
              {listening
                ? transcript
                : showHighlightText
                ? highlightedText
                : "Begin recording to see your transcript"}
            </p>
          </div>
        </div>
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
