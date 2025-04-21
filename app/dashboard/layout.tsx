"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/lib/auth-context";
import { cn } from "@/src/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-4 space-y-4 rounded-lg border p-4 shadow-sm">
          <div className="mb-4 border-b pb-2">
            <p className="font-medium">
              Welcome, {user?.email || "User"}
            </p>
          </div>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className={cn(
                "block w-full rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
                pathname === "/dashboard" &&
                  "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
              )}
            >
              All Feeds
            </Link>
            <Link
              href="/dashboard/favorites"
              className={cn(
                "block w-full rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800",
                pathname === "/dashboard/favorites" &&
                  "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400"
              )}
            >
              Favorites
            </Link>
            <button
              onClick={() => logout()}
              className="block w-full rounded-md p-2 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Logout
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1">{children}</div>
    </div>
  );
}
