"use client";

import { useState } from "react";
import { useAuth } from "@/src/lib/auth-context";
import Link from "next/link";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed"
      );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 space-y-8 border rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 rounded-md bg-red-50 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
