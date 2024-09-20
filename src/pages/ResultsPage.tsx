import React from "react";
import { useLocation } from "react-router-dom";
import ResultsCard from "../components/ResultsCard";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const { audioURL } = location.state || {}; // Get audioURL from state

  if (!audioURL) {
    return <div>No audio file provided.</div>; // Handle missing audioURL
  }

  return <ResultsCard audioURL={audioURL} />;  // Pass audioURL to ResultsCard
};

export default ResultsPage;
