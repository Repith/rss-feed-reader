"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { feedsApi } from "@/src/lib/api-client";
import Link from "next/link";

export default function DashboardPage() {
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: feeds, isLoading } = useQuery({
    queryKey: ["feeds"],
    queryFn: feedsApi.getAll,
  });

  const addFeedMutation = useMutation({
    mutationFn: feedsApi.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["feeds"],
      });
      setNewFeedUrl("");
    },
    onError: (err) => {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add feed"
      );
    },
  });

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

  const handleAddFeed = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newFeedUrl) return;

    addFeedMutation.mutate(newFeedUrl);
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold">
        Your RSS Feeds
      </h1>

      <div className="mb-8 rounded-lg border p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">
          Add New Feed
        </h2>
        <form
          onSubmit={handleAddFeed}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <input
            type="url"
            value={newFeedUrl}
            onChange={(e) => setNewFeedUrl(e.target.value)}
            placeholder="Enter RSS feed URL"
            className="flex-1 rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800"
            required
          />
          <button
            type="submit"
            disabled={addFeedMutation.isPending}
            className="rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-70"
          >
            {addFeedMutation.isPending
              ? "Adding..."
              : "Add Feed"}
          </button>
        </form>
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="text-center">Loading feeds...</div>
      ) : feeds?.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-lg">
            You don't have any feeds yet.
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add your first RSS feed above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {feeds?.map((feed) => (
            <div
              key={feed.id}
              className="flex flex-col rounded-lg border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
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
                <Link
                  href={`/dashboard/feeds/${feed.id}`}
                  className="rounded-md bg-primary-100 px-3 py-1 text-sm text-primary-800 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300"
                >
                  View Articles
                </Link>
                <button
                  onClick={() =>
                    refreshFeedMutation.mutate(feed.id)
                  }
                  disabled={refreshFeedMutation.isPending}
                  className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Refresh
                </button>
                <button
                  onClick={() =>
                    deleteFeedMutation.mutate(feed.id)
                  }
                  disabled={deleteFeedMutation.isPending}
                  className="rounded-md bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
