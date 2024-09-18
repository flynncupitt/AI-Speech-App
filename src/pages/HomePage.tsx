import React from "react";
import imagePath from "../assets/app-logo.png";
import NavBar from "../components/NavBar.tsx";

export default function HomePage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <NavBar
        brandName="AI Speech Clarity"
        imageSrcPath={imagePath}
        navItems={["Home"]}
      />
      <section className="hero-section py-32 px-6 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
          <div className="md:w-1/2 order-2 md:order-1 text-center md:text-left space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Improve Your Speech with Our{" "}
              <span className="text-indigo-400">Speech Clarity App</span>
            </h1>
            <p className="text-lg md:text-xl">
              Empower your communication with our advanced AI-driven speech
              clarity solutions. Achieve clearer and more effective speech in
              any environment.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="/register"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold"
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
