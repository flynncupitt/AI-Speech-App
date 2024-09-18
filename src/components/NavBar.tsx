import { useState } from "react";

interface NavBarProps {
  brandName: string;
  imageSrcPath: string;
}

function NavBar({ brandName, imageSrcPath }: NavBarProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <a className="flex items-center" href="#">
          <img
            src={imageSrcPath}
            alt=""
            width="60"
            height="60"
            className="mr-3"
          />
          <span className="text-white font-bold text-xl">{brandName}</span>
        </a>
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-4`}
        >
          <div className="flex space-x-3 mt-3 md:mt-0">
            <a
              href="/login"
              className="border border-white text-white py-1 px-3 rounded-md hover:bg-white hover:text-gray-800 transition"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-primary text-white py-1 px-3 rounded-md hover:bg-gray-300 transition"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
