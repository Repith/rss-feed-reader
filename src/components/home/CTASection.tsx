import Link from "next/link";

export function CTASection() {
  return (
    <section className="p-8 text-center bg-pink-100 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-2xl font-bold text-pink-700 dark:text-pink-400">
        Ready to simplify your reading experience?
      </h2>
      <p className="max-w-2xl mx-auto mb-6 text-gray-600 dark:text-gray-400">
        Join thousands of readers who use our RSS Reader to
        stay informed without the noise.
      </p>
      <Link
        href="/signup"
        className="inline-block px-6 py-3 font-medium text-white transition-all rounded-md bg-gradient-to-r from-pink-500 to-violet-500 hover:shadow-lg"
      >
        Create Your Account
      </Link>
    </section>
  );
}
