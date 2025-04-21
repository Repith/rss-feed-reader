import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSS Reader",
  description: "A modern RSS reader application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="bg-primary-600 text-white shadow-md">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              RSS Reader
            </Link>
            <nav className="space-x-4">
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
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <Providers>{children}</Providers>
        </main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} RSS Reader.
            All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
