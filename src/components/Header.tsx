"use client";

import Link from "next/link";
import { useAuth } from "@/src/lib/auth-context";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          RSS Reader
        </Link>
        <nav className="space-x-4">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/favorites" className="hover:underline">
                Favorites
              </Link>
              <button 
                onClick={() => logout()} 
                className="hover:underline text-red-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}