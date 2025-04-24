"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { feedsApi } from "@/src/lib/api-client";
import { EditFeedModal } from "./EditFeedModal";

interface Feed {
  id: string;
  title: string;
  url: string;
  category?: string;
}

interface FeedListProps {
  feeds: Feed[] | undefined;
  activeTab: string;
}

export function FeedList({
  feeds,
  activeTab,
}: FeedListProps) {
  const [editingFeed, setEditingFeed] =
    useState<Feed | null>(null);
  const queryClient = useQueryClient();

  const deleteFeedMutation = useMutation({
    mutationFn: feedsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feeds"],
      });
    },
  });

  const refreshFeedMutation = useMutation({
    mutationFn: feedsApi.refresh,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feeds"],
      });
    },
  });

  // Group feeds by category
  const feedCategories =
    feeds?.reduce((acc, feed) => {
      const category = feed.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(feed);
      return acc;
    }, {} as Record<string, Feed[]>) || {};

  const filteredFeeds =
    activeTab === "all"
      ? feeds
      : feedCategories[activeTab] || [];

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {filteredFeeds?.map((feed, index) => (
            <motion.div
              key={feed.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between"
              whileHover={{
                y: -2,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="mb-3 sm:mb-0">
                <h3 className="font-medium">
                  {feed.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feed.url}
                </p>
              </div>
              <div className="flex gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={`/dashboard/feeds/${feed.id}`}
                    className="px-3 py-1 text-sm text-pink-800 rounded-md bg-gradient-to-r from-pink-600/20 to-violet-600/20 hover:from-pink-600/30 hover:to-violet-600/30 dark:text-pink-300"
                  >
                    View Articles
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditingFeed(feed)}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    refreshFeedMutation.mutate(feed.id)
                  }
                  disabled={refreshFeedMutation.isPending}
                  className="px-3 py-1 text-sm bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    deleteFeedMutation.mutate(feed.id)
                  }
                  disabled={deleteFeedMutation.isPending}
                  className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded-md cursor-pointer hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {editingFeed && (
        <EditFeedModal
          feed={editingFeed}
          isOpen={!!editingFeed}
          onClose={() => setEditingFeed(null)}
        />
      )}
    </>
  );
}
