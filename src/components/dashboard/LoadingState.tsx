"use client";

import { motion } from "framer-motion";

export function LoadingState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center p-8"
    >
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-pink-600 border-r-transparent"></div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Loading feeds...</p>
    </motion.div>
  );
}

export function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 text-center border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      <p className="text-lg">You don&apos;t have any feeds yet.</p>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Add your first RSS feed above to get started.
      </p>
    </motion.div>
  );
}