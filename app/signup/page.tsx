"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { register, loading, user } = useAuth();
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
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await register(email, password, name);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed"
      );
    }
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Create Account
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join RSS Reader to organize your content
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
                htmlFor="name"
                className="block text-sm font-medium"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Your name"
              />
            </div>
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
                minLength={8}
                className="block w-full p-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:border-gray-700 dark:bg-gray-800"
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white rounded-md bg-primary-600 hover:bg-primary-700 disabled:opacity-70"
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
