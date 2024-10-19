import React, { useState, useEffect } from "react";
import imagePath from "../assets/app-logo.png";
import NavBar from "../components/NavBar.tsx";

export default function HomePage() {
  const titles = ["Master your", "Sound more", "Own every"];
  const highlightedWords = ["message.", "sophisticated.", "conversation."];
  const [title1, setTitle1] = useState(titles[0]);
  const [title2, setTitle2] = useState(highlightedWords[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setTitle1((prev) => titles[(titles.indexOf(prev) + 1) % titles.length]);
        setTitle2((prev) => highlightedWords[(highlightedWords.indexOf(prev) + 1) % highlightedWords.length]);
        setFade(true);
      }, 400);
    }, 4000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="bg-[#18151c] min-h-screen text-white">
      <NavBar
        brandName="Clarity"
        imageSrcPath={imagePath}
      />
      <section className="hero-section py-32 px-6 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
          <div className="md:w-1/2 order-2 md:order-1 text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              <span className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
                {title1} <span className="text-primary">{title2}</span>
              </span>
            </h1>
            <p className="text-lg md:text-xl">
              Cut the fillers and speak with confidence. Get real-time insights
              and personalized guidance to refine your delivery and sound more
              polished in any conversation.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="/register"
                className="bg-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Register
              </a>
              <a
                href="/login"
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Login
              </a>
              {/* <a
                href="/dashboard"
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold"
              >
                Dashboard
              </a> */}
            </div>
          </div>
          <div className="md:w-1/2 order-1 md:order-2 text-center">
            <img
              src={imagePath}
              alt="AI Speech Clarity"
              className="w-3/4 md:w-full max-w-lg mx-auto transform md:rotate-3 hover:rotate-0 transition duration-500 ease-in-out"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
