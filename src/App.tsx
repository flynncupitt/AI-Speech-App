import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestPage from "./pages/TestPage";
import HomePage from "./pages/HomePage";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test-page" element={<TestPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
