// import React from "react";
// import "regenerator-runtime/runtime";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// const SpeechTextTest = () => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? "on" : "off"}</p>
//       <button onClick={() => SpeechRecognition.startListening()}>Start</button>
//       <button onClick={SpeechRecognition.stopListening}>Stop</button>
//       <button onClick={resetTranscript}>Reset</button>
//       <p>Transscript:</p>
//       <p>{transcript}</p>
//     </div>
//   );
// };
// export default SpeechTextTest;
