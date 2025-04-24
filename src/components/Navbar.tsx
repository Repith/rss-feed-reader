"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth-context";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full border-b shadow-md backdrop-blur-md",
        "bg-white/80 dark:bg-gray-900/80",
        "border-pink-200 dark:border-gray-800"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-xl font-bold text-pink-600 dark:text-pink-400"
          >
            RSS Reader
          </Link>
        </div>

        <div className="flex items-center">
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
                    "hover:text-pink-600 dark:hover:text-pink-400",
                    isActive("/dashboard") &&
                      "text-pink-600 dark:text-pink-400 font-medium"
                  )}
                >
                  All Feeds
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className={clsx(
                    "transition-colors",
                    "text-gray-700 dark:text-gray-300",
                    "hover:text-pink-600 dark:hover:text-pink-400",
                    isActive("/dashboard/favorites") &&
                      "text-pink-600 dark:text-pink-400 font-medium"
                  )}
                >
                  Favorites
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

          {/* Mobile menu button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col p-4 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className={clsx(
                      "transition-colors",
                      "text-gray-700 dark:text-gray-300",
                      "hover:text-pink-600 dark:hover:text-pink-400",
                      isActive("/dashboard") &&
                        "text-pink-600 dark:text-pink-400 font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    All Feeds
                  </Link>
                  <Link
                    href="/dashboard/favorites"
                    className={clsx(
                      "transition-colors",
                      "text-gray-700 dark:text-gray-300",
                      "hover:text-pink-600 dark:hover:text-pink-400",
                      isActive("/dashboard/favorites") &&
                        "text-pink-600 dark:text-pink-400 font-medium"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favorites
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
        </div>
      )}
    </header>
  );
}
