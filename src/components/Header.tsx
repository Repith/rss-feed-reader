"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth-context";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="text-white bg-pink-600 shadow-md">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <Link href="/" className="text-xl font-bold">
          RSS Reader
        </Link>
        <nav className="space-x-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:underline"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/favorites"
                className="hover:underline"
              >
                Favorites
              </Link>
              <button
                onClick={() => logout()}
                className="text-pink-200 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:underline"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
