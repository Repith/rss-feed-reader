import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container max-w-6xl px-4 py-12 mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-8 mb-16 md:flex-row">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            Stay Updated with{" "}
            <span className="text-primary-600">
              RSS Reader
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Organize and read all your favorite content in
            one place. A modern, clean RSS reader for the
            web.
          </p>
          <div className="flex flex-col gap-4 pt-4 sm:flex-row">
            <Link
              href="/signup"
              className="px-6 py-3 font-medium text-center text-white rounded-md bg-primary-600 hover:bg-primary-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 font-medium text-center border border-gray-300 rounded-md dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Log In
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/rss-hero.svg"
            alt="RSS Reader illustration"
            width={500}
            height={400}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="mb-12 text-3xl font-bold text-center">
          Key Features
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 transition-shadow border rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Organize Feeds
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Add and organize all your favorite websites
              and blogs in one place.
            </p>
          </div>
          <div className="p-6 transition-shadow border rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Save Favorites
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bookmark your favorite articles to read later
              or reference again.
            </p>
          </div>
          <div className="p-6 transition-shadow border rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get the latest content from your favorite
              sources automatically.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="p-8 text-center bg-gray-100 rounded-lg dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold">
          Ready to simplify your reading experience?
        </h2>
        <p className="max-w-2xl mx-auto mb-6 text-gray-600 dark:text-gray-400">
          Join thousands of readers who use our RSS Reader
          to stay informed without the noise.
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 font-medium text-white rounded-md bg-primary-600 hover:bg-primary-700"
        >
          Create Your Account
        </Link>
      </section>
    </div>
  );
}
