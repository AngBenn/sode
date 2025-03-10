import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the menu open/closed
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <div>
      {/* Menu toggle icon (to be placed inside your Dashboard header) */}
      <button
        onClick={toggleMenu}
        className="p-2 focus:outline-none hover:bg-[#3C2A73] rounded-lg transition-colors"
      >
        {isOpen ? (
          <HiX size={30} className="text-white" />
        ) : (
          <HiMenu size={30} className="text-white" />
        )}
      </button>

      {/* Sliding menu container */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#3C2A73] text-white transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button inside the menu */}
        <button
          onClick={toggleMenu}
          className="absolute top-4 right-4 p-2 focus:outline-none hover:bg-[#272052] rounded-full transition-colors"
        >
          <HiX size={24} className="text-white" />
        </button>

        {/* Menu content */}
        <nav className="mt-16 flex flex-col">
          <Link
            to="/dashboard"
            className="px-6 py-3 hover:bg-[#272052] transition-colors"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className="px-6 py-3 hover:bg-[#272052] transition-colors"
            onClick={toggleMenu}
          >
            Profile
          </Link>
          <Link
            to="/progress&tracking"
            className="px-6 py-3 hover:bg-[#272052] transition-colors"
            onClick={toggleMenu}
          >
            Progress & Tracking
          </Link>
          
        </nav>
      </div>

      {/* Overlay to close the menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
}