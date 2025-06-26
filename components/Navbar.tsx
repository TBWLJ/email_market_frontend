"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "ProfileList", path: "/profileList" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl tracking-wide cursor-pointer">
            <Link href="/">FancyBrand</Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                className="hover:text-yellow-300 transition-colors duration-300 font-medium"
              >
                {name}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!menuOpen ? (
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                </svg>
              ) : (
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-700">
          <div
            id="mobile-menu"
            className="px-2 pt-2 pb-3 space-y-1 sm:px-3"
          >
            {navLinks.map(({ name, path }) => (
              <Link
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-500 transition"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
