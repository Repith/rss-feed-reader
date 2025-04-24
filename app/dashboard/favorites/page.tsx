"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { articlesApi } from "@/src/lib/api-client";
import Link from "next/link";
import { format } from "date-fns";
import { ArticlePreview } from "@/src/components/dashboard/ArticlePreview";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Icons } from "@/src/lib/styles/icons/Icon";

export default function FavoritesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: articles, isLoading } = useQuery({
    queryKey: ["favorites", debouncedQuery, unreadOnly],
    queryFn: () =>
      articlesApi.getFavorites({
        query: debouncedQuery || undefined,
        unreadOnly: unreadOnly,
      }),
  });

  const favoriteArticleMutation = useMutation({
    mutationFn: ({
      id,
      isFavorite,
    }: {
      id: string;
      isFavorite: boolean;
    }) => articlesApi.markAsFavorite(id, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", debouncedQuery, unreadOnly],
      });
    },
  });

  const readArticleMutation = useMutation({
    mutationFn: ({
      id,
      isRead,
    }: {
      id: string;
      isRead: boolean;
    }) => articlesApi.markAsRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["favorites", debouncedQuery, unreadOnly],
      });
    },
  });

  return (
    <div className="container max-w-4xl p-4 mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-600 hover:underline dark:text-gray-400"
        >
          ← Back to feeds
        </Link>
        <h1 className="text-2xl font-bold">
          Favorite Articles
        </h1>
      </div>

      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icons
              name="search"
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
            />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title..."
            className="w-full py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 text-sm border rounded-lg transition-colors",
            unreadOnly
              ? "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
              : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
          )}
        >
          <Icons name="filter" className="w-4 h-4" />
          {unreadOnly ? "Unread only" : "All articles"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center">
          Loading favorites...
        </div>
      ) : articles?.length === 0 ? (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-lg">
            {searchQuery || unreadOnly
              ? "No articles match your filters."
              : "You don't have any favorite articles yet."}
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {searchQuery || unreadOnly
              ? "Try adjusting your search or filters."
              : "Mark articles as favorites to see them here."}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {articles?.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArticlePreview
                  title={article.title}
                  content={article.content || ""}
                  snippet={article.snippet || ""}
                  link={article.link}
                  publishedAt={
                    article.publishedAt
                      ? format(
                          new Date(article.publishedAt),
                          "MMM d, yyyy"
                        )
                      : "No date"
                  }
                  isFavorite={article.isFavorite}
                  isRead={article.isRead}
                  imageUrl={article.imageUrl}
                  onFavoriteToggle={() =>
                    favoriteArticleMutation.mutate({
                      id: article.id,
                      isFavorite: !article.isFavorite,
                    })
                  }
                  onReadToggle={() =>
                    readArticleMutation.mutate({
                      id: article.id,
                      isRead: !article.isRead,
                    })
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
