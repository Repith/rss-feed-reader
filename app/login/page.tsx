"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

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

  async function loginAsDemo() {
    setError("");
    try {
      await login("test@test.com", "testtest");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Demo login failed"
      );
    }
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen pb-28 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-pink-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to access your feeds
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={clsx(
                  "block w-full p-3 mt-1 border rounded-md shadow-sm",
                  "border-gray-300 dark:border-gray-700 dark:bg-gray-800",
                  "focus:ring-pink-500 focus:border-pink-500"
                )}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={clsx(
                  "block w-full p-3 mt-1 border rounded-md shadow-sm",
                  "border-gray-300 dark:border-gray-700 dark:bg-gray-800",
                  "focus:ring-pink-500 focus:border-pink-500"
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "w-full py-3 text-white rounded-md transition-colors",
              "bg-gradient-to-r from-pink-600 to-violet-600",
              "hover:from-pink-700 hover:to-violet-700 hover:shadow-md",
              "disabled:opacity-70"
            )}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={loginAsDemo}
            disabled={loading}
            className={clsx(
              "w-full py-3 mt-3 text-gray-700 rounded-md transition-colors",
              "bg-gray-100 dark:bg-gray-700 dark:text-gray-200",
              "hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-sm",
              "disabled:opacity-70"
            )}
          >
            Login as Demo User
          </button>

          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-pink-600 dark:text-pink-400 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
