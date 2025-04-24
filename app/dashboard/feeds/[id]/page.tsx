"use client";

import { use } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  feedsApi,
  articlesApi,
} from "@/src/lib/api-client";
import Link from "next/link";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import {
  LoadingState,
  EmptyState,
} from "@/src/components/dashboard/LoadingState";

export default function FeedArticlesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: feedId } = use(params);
  const queryClient = useQueryClient();

  const { data: feed, isLoading: isFeedLoading } = useQuery(
    {
      queryKey: ["feed", feedId],
      queryFn: () => feedsApi.getById(feedId),
    }
  );

  const { data: articles, isLoading: isArticlesLoading } =
    useQuery({
      queryKey: ["articles", feedId],
      queryFn: () => feedsApi.getArticles(feedId),
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
        queryKey: ["articles", feedId],
      });
    },
  });

  const isLoading = isFeedLoading || isArticlesLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl p-4 mx-auto"
    >
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-gray-600 transition-colors hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400"
        >
          ← Back to feeds
        </Link>
        <h1 className="text-2xl font-bold">
          {feed?.title || "Loading..."}
        </h1>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : articles?.length === 0 ? (
        <EmptyState />
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
                className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                whileHover={{
                  y: -2,
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {article.publishedAt
                      ? format(
                          new Date(article.publishedAt),
                          "MMM d, yyyy"
                        )
                      : "No date"}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      favoriteArticleMutation.mutate({
                        id: article.id,
                        isFavorite: !article.isFavorite,
                      })
                    }
                    className={cn(
                      "flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-300 cursor-pointer",
                      article.isFavorite
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400"
                    )}
                  >
                    <motion.span
                      initial={false}
                      animate={
                        article.isFavorite
                          ? {
                              scale: [1, 1.5, 1],
                              rotate: [0, 15, 0],
                            }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {article.isFavorite ? "★" : "☆"}
                    </motion.span>
                    {article.isFavorite
                      ? "Favorited"
                      : "Add to favorites"}
                  </motion.button>
                </div>
                <h2 className="mb-2 text-xl font-medium">
                  {article.title}
                </h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  {article?.content?.substring(0, 200)}
                  {article.content &&
                  article.content.length > 200
                    ? "..."
                    : ""}
                </p>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start px-4 py-2 text-white rounded-md bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700"
                >
                  Read Article
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}
