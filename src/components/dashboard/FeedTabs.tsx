"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface FeedTabsProps {
  categories: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function FeedTabs({ categories, activeTab, setActiveTab }: FeedTabsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={cn(
              "px-4 py-2 font-medium whitespace-nowrap relative",
              activeTab === category 
                ? "text-pink-600 dark:text-pink-400" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
            {activeTab === category && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-600 to-violet-600" 
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}