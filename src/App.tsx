import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Upload from "./components/upload.tsx";

const App: React.FC = () => {
  return (
    <div>
      <h1>My App</h1>
      <Upload />
    </div>
  );
};

export default App;
