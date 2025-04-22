"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

  if (user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
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
                className="block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800"
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
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white rounded-md bg-primary-600 hover:bg-primary-700 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
