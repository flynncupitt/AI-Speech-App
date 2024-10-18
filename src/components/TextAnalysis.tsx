//EXAMPLE WORK THAT COULD BE IMPLEMENTED IF NEEDED

import { useState } from "react";

const TextAnalysis = () => {
  const [text, setText] = useState("");
  const fillerWords = ["um", "ah", "so", "uh"];
  const [highlightedText, setHText] = useState("");

  const analyseText = () => {
    const arr = text.split(" ");
    console.log(arr);

    var outputText = arr
      .map((word) => {
        if (fillerWords.includes(word.toLowerCase())) {
          return `<mark>${word}</mark>`;
        }
        return word;
      })
      .join(" ");
    setHText(outputText);
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-[80vw]">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="textarea textarea-secondary w-6/12 h-20"
        placeholder="Enter text here"
      ></textarea>
      <button className="btn bg-primary" onClick={() => analyseText()}>
        Analyse Text
      </button>
      <p dangerouslySetInnerHTML={{ __html: highlightedText }}></p>
    </div>
  );
};

export default TextAnalysis;
