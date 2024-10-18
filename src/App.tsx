import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecordSubmitPage from "./pages/RecordSubmitAudioPage";

import "./App.css";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RecordingsPage from "./pages/RecordingsPage";
import GoalTrackerPage from "./pages/GoalTrackerPage";
import { TutorialPage } from "./pages/TutorialPage";
import { UserDashboard } from "./pages/UserDashboard";
import Layout from "./components/Layout";
import LandingPageLayout from "./components/LandingPageLayout";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import SettingsPage from "./pages/SettingsPage";

const AppRoutes = () => {
  const location = useLocation();

  // Define the routes that should not have the layout
  const noLayoutRoutes = ["/", "/register", "/login"];

  return (
    <>
      {/* These routes will have the dashboard header */}
      {!noLayoutRoutes.includes(location.pathname) ? (
        <Layout>
          <Routes>
            <Route path="/record" element={<RecordSubmitPage />}></Route>
            <Route path="/recordings" element={<RecordingsPage />}></Route>
            <Route path="/tutorial" element={<TutorialPage />}></Route>
            <Route path="/dashboard" element={<UserDashboard />}></Route>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/goal-tracker" element={<GoalTrackerPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      ) : (
        <LandingPageLayout>
          <Routes>
            {/* Put pages here that should not have the dashboard header (make sure path is in noLayoutRoutes too) */}
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
          </Routes>
        </LandingPageLayout>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
