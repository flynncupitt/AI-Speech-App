import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const SpeechTextTest = () => {
  const fillerWords = ["um", "uh", "like", "you know", "basically", "actually"];
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
            <span key={index} className={isFiller ? "bg-green-500" : ""}>
              {word}{" "}
            </span>
          );
        })}
      </span>
    );
  };

  const customStopListening = () => {
    SpeechRecognition.stopListening();
    setHighlightedText(highlightFillerWords(transcript));
  };
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? "on" : "off"}</p>
      <button
        onClick={() => SpeechRecognition.startListening({ continuous: true })}
      >
        Start
      </button>
      <button onClick={customStopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
      <p>Transscript:</p>
      <p>{transcript}</p>
      <p>Highlighted:</p>
      <p>{highlightedText}</p>
    </div>
  );
};
export default SpeechTextTest;
