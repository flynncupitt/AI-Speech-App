import React, { useRef, useState } from "react";
import RecordingStopwatch from "../components/RecordingStopwatch";
import NavBar from "../components/NavBar";

export default function RecordSubmitAudioPage() {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

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
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];
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
      {/* https://javascript.plainenglish.io/mic-audio-visualizer-using-react-and-canvas-4e89905141ac */}
      <div className="flex flex-grow items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <button
            className={`bg-purple-600 ${isRecording ? "h-10" : "h-16"} ${
              isRecording ? "w-10" : "w-16"
            } ${
              isRecording ? "rounded-lg" : "rounded-full"
            } focus:outline-none`}
            onClick={() => {
              // isRecording ? stopRecording : startRecording;
              isRecording ? stopRecording() : startRecording();
              setIsRecording(!isRecording);
            }}
          ></button>
          <div className="absolute w-full h-full border-4 border-zinc-700 rounded-full transform scale-100 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
