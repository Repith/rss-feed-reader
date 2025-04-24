import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-8 mb-16 md:flex-row">
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
          Stay Updated with{" "}
          <span className="text-transparent bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text">
            RSS Reader
          </span>
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-200">
          Organize and read all your favorite content in one
          place. A modern, clean RSS reader for the web.
        </p>
        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <Link
            href="/signup"
            className="px-6 py-3 text-white transition-all rounded-md bg-gradient-to-r from-pink-500 to-violet-500 hover:shadow-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className={clsx(
              "px-6 py-3 font-medium text-center rounded-md transition-colors",
              "border border-pink-200 text-gray-800",
              "dark:border-gray-700 dark:text-gray-200",
              "hover:bg-pink-50 dark:hover:bg-gray-800"
            )}
          >
            Log In
          </Link>
        </div>
      </div>
      <div
        className={clsx(
          "flex-1 p-6 rounded-lg flex items-center justify-center",
          "bg-pink-100 dark:bg-gray-800",
          "shadow-md"
        )}
      >
        <div className="w-4/5 max-w-[300px]">
          <Image
            src="/rss-hero.svg"
            alt="RSS Reader illustration"
            width={180}
            height={180}
            className={clsx(
              "w-full h-auto",
              "dark:invert-[0.15] dark:hue-rotate-15 dark:brightness-90"
            )}
            priority
          />
        </div>
      </div>
    </section>
  );
}
