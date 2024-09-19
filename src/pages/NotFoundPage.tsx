import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#18151c] text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
        Oops! The page you are looking for doesn't exist.
      </p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-primary text-white rounded-lg"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
