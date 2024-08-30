import { useState } from "react";

interface NavBarProps {
  brandName: string;
  imageSrcPath: string;
  navItems: string[];
}

function NavBar({ brandName, imageSrcPath, navItems }: NavBarProps) {
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
          <ul className="flex flex-col md:flex-row md:space-x-4">
            {navItems.map((item, index) => (
              <li
                key={item}
                className={`${
                  selectedIndex === index ? "text-gray-300" : "text-white"
                } cursor-pointer`}
                onClick={() => setSelectedIndex(index)}
              >
                <a className="block px-2 py-1" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex space-x-3 mt-3 md:mt-0">
            <a href="#login" className="btn btn-outline-light me-3">
              <a
                href="#login"
                className="border border-white text-white py-1 px-3 rounded hover:bg-white hover:text-gray-800 transition"
              >
                Login
              </a>
              <a
                href="#register"
                className="bg-white text-gray-800 py-1 px-3 rounded hover:bg-gray-300 transition"
              >
                Register
              </a>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
