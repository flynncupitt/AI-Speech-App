import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecordSubmitPage from "./pages/RecordSubmitAudioPage";

import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RecordingsPage from "./pages/RecordingsPage";
import GoalTrackerPage from "./pages/GoalTrackerPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* If you need to make a new route:
        - Set the path to whatever you want it to be e.g /path-name
        - element={<NameOfPageComponent />} <-- straight forward, name is whatever its exported as in the component's .tsx file
        - link to the page from a button with: <a href="/path-name"> etc
        */}
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/record" element={<RecordSubmitPage />}></Route>
        <Route path="/recordings" element={<RecordingsPage />}></Route>
        <Route path="/goal-tracker" element={<GoalTrackerPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
