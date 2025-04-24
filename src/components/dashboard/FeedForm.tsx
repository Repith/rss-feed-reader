"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { feedsApi } from "@/src/lib/api-client";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export function FeedForm() {
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: feeds } = useQuery({
    queryKey: ["feeds"],
    queryFn: feedsApi.getAll,
  });

  const existingCategories = feeds
    ? [
        ...new Set(
          feeds.map((feed) => feed.category).filter(Boolean)
        ),
      ]
    : [];

  const addFeedMutation = useMutation({
    mutationFn: (data: {
      url: string;
      category?: string;
    }) => feedsApi.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feeds"],
      });
      setNewFeedUrl("");
      setCategory("");
    },
    onError: (err) => {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add feed"
      );
    },
  });

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newFeedUrl) return;
    addFeedMutation.mutate({
      url: newFeedUrl,
      category: category || undefined,
    });
  };

  const selectCategory = (selectedCategory: string) => {
    setCategory(
      selectedCategory === category ? "" : selectedCategory
    );
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="p-4 mb-8 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
    >
      <h2 className="mb-4 text-lg font-medium">
        Add New Feed
      </h2>
      <form
        onSubmit={handleAddFeed}
        className="flex flex-col gap-4"
      >
        <input
          type="url"
          value={newFeedUrl}
          onChange={(e) => setNewFeedUrl(e.target.value)}
          placeholder="Enter RSS feed URL"
          className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>

          <div className="flex gap-2 mb-2">
            {existingCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  selectCategory(cat || "Uncategorized")
                }
                className={cn(
                  "px-3 py-0.5 text-xs rounded-full transition-colors cursor-pointer border",
                  category === cat
                    ? "bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700/50 font-medium"
                    : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {cat}
              </button>
            ))}

            <input
              type="text"
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter custom category"
              className=" p-1.5 px-3 text-xs border border-gray-300 rounded-full dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={addFeedMutation.isPending}
          className="self-end px-4 py-2 text-sm text-white rounded-md bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 hover:shadow-md disabled:opacity-70"
        >
          {addFeedMutation.isPending
            ? "Adding..."
            : "Add Feed"}
        </motion.button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </motion.div>
  );
}
