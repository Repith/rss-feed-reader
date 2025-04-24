"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedsApi } from "@/src/lib/api-client";
import { cn } from "@/src/lib/utils";

interface EditFeedModalProps {
  feed: {
    id: string;
    title: string;
    url: string;
    category?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EditFeedModal({ feed, isOpen, onClose }: EditFeedModalProps) {
  const [url, setUrl] = useState(feed.url);
  const [category, setCategory] = useState(feed.category || "");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      setUrl(feed.url);
      setCategory(feed.category || "");
      setError("");
    }
  }, [isOpen, feed]);

  const updateFeedMutation = useMutation({
    mutationFn: (data: { id: string; url: string; category?: string }) => 
      feedsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      onClose();
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to update feed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!url) return;
    
    updateFeedMutation.mutate({
      id: feed.id,
      url,
      category: category || undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800"
      >
        <h2 className="mb-4 text-xl font-medium">Edit Feed</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Feed URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={updateFeedMutation.isPending}
              className={cn(
                "px-4 py-2 text-sm text-white rounded-md bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700 disabled:opacity-70"
              )}
            >
              {updateFeedMutation.isPending ? "Updating..." : "Update Feed"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}