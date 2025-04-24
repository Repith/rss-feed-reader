"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth-context";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import clsx from "clsx";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full border-b shadow-md backdrop-blur-md",
        "bg-white/80 dark:bg-gray-900/80",
        "border-pink-200 dark:border-gray-800"
      )}
    >
      <div className="container px-4 py-3 mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-pink-600"
            >
              <path d="M4 11a9 9 0 0 1 9 9" />
              <path d="M4 4a16 16 0 0 1 16 16" />
              <circle cx="5" cy="19" r="1" />
            </svg>
            <span className="text-xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text">
              RSS Reader
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-6 md:flex">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className={clsx(
                    "transition-colors",
                    "text-gray-700 dark:text-gray-300",
                    "hover:text-pink-600 dark:hover:text-pink-400"
                  )}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => logout()}
                  className={clsx(
                    "px-4 py-2 rounded-md transition-colors",
                    "text-red-600 dark:text-red-400",
                    "bg-red-100 dark:bg-red-900/30",
                    "hover:bg-red-200 dark:hover:bg-red-900/50"
                  )}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={clsx(
                    "px-4 py-2 rounded-md transition-colors",
                    "text-gray-700 dark:text-gray-300",
                    "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={clsx(
                    "px-4 py-2 rounded-md transition-colors",
                    "text-white",
                    "bg-pink-600 hover:bg-pink-700"
                  )}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={clsx(
              "py-4 mt-4 border-t md:hidden",
              "border-gray-200 dark:border-gray-800"
            )}
          >
            <nav className="flex flex-col space-y-4">
              <Link
                href="/#features"
                className={clsx(
                  "transition-colors",
                  "text-gray-700 dark:text-gray-300",
                  "hover:text-pink-600 dark:hover:text-pink-400"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className={clsx(
                  "transition-colors",
                  "text-gray-700 dark:text-gray-300",
                  "hover:text-pink-600 dark:hover:text-pink-400"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={clsx(
                      "transition-colors",
                      "text-gray-700 dark:text-gray-300",
                      "hover:text-pink-600 dark:hover:text-pink-400"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className={clsx(
                      "px-4 py-2 text-left rounded-md transition-colors",
                      "text-red-600 dark:text-red-400",
                      "bg-red-100 dark:bg-red-900/30",
                      "hover:bg-red-200 dark:hover:bg-red-900/50"
                    )}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={clsx(
                      "px-4 py-2 rounded-md transition-colors",
                      "text-gray-700 dark:text-gray-300",
                      "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={clsx(
                      "px-4 py-2 rounded-md transition-colors",
                      "text-white",
                      "bg-pink-600 hover:bg-pink-700"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <div className="flex items-center pt-2">
                <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">
                  Theme:
                </span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
