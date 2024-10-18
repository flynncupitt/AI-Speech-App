import { useState } from "react";

interface NavBarProps {
  brandName: string;
  imageSrcPath: string;
}

function NavBar({ brandName, imageSrcPath }: NavBarProps) {
  const [] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-navBar shadow">
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
          className="md:hidden text-white bg-[#17151B] p-2 rounded focus:outline-none hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6h18" />
            <path d="M3 12h18" />
            <path d="M3 18h18" />
          </svg>
        </button>
        <div
          className={`${
            isOpen ? "hidden" : "hidden"
          } md:flex md:items-center md:space-x-4`}
        >
          <div className="flex space-x-3 mt-3 md:mt-0">
            <a
              href="/login"
              className="border border-white text-white py-1 px-3 rounded-md hover:bg-white hover:text-gray-800 transition hidden md:block"
            >
              Login
            </a>
            <a
              href="/register"
              className="bg-primary text-white py-1 px-3 rounded-md hover:bg-gray-300 transition hidden md:block"
            >
              Register
            </a>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-navBar text-white py-2 px-4">
          <a
            href="/register"
            className="block py-2 hover:bg-gray-700 rounded-md"
          >
            Register
          </a>
          <a href="/login" className="block py-2 hover:bg-gray-700 rounded-md">
            Login
          </a>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
