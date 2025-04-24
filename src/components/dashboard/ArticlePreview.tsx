"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface ArticlePreviewProps {
  title: string;
  content: string;
  snippet: string;
  link: string;
  publishedAt: string;
  isFavorite: boolean;
  isRead: boolean;
  onFavoriteToggle: () => void;
  onReadToggle: () => void;
  imageUrl?: string | null;
}

export function ArticlePreview({
  title,
  content,
  snippet,
  link,
  publishedAt,
  isFavorite,
  isRead,
  onFavoriteToggle,
  onReadToggle,
  imageUrl,
}: ArticlePreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        layout
        className={cn(
          "flex flex-col p-4 border border-gray-200 rounded-lg shadow-sm",
          isRead
            ? "bg-gray-50 dark:bg-gray-900"
            : "bg-white dark:bg-gray-800",
          "dark:border-gray-700"
        )}
        whileHover={{
          y: -2,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {publishedAt}
          </span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReadToggle}
              className={cn(
                "flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-300 cursor-pointer",
                isRead
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
              )}
            >
              <motion.span
                initial={false}
                animate={
                  isRead
                    ? {
                        scale: [1, 1.5, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                {isRead ? "✓" : "○"}
              </motion.span>
              {isRead ? "Read" : "Mark as read"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFavoriteToggle}
              className={cn(
                "flex items-center gap-1 px-3 py-1 text-sm rounded-full transition-all duration-300 cursor-pointer",
                isFavorite
                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-500 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400"
              )}
            >
              <motion.span
                initial={false}
                animate={
                  isFavorite
                    ? {
                        scale: [1, 1.5, 1],
                        rotate: [0, 15, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                {isFavorite ? "★" : "☆"}
              </motion.span>
              {isFavorite
                ? "Favorited"
                : "Add to favorites"}
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {imageUrl && (
            <div className="flex-shrink-0 w-full overflow-hidden rounded-lg md:w-1/3 md:h-48">
              <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !imageUrl && "w-full"
            )}
          >
            <h2 className="mb-2 text-xl font-semibold leading-tight text-gray-900 dark:text-gray-100 line-clamp-2">
              {title}
            </h2>
            <p className="mb-auto text-sm leading-relaxed text-gray-700 dark:text-gray-300 line-clamp-3">
              {snippet}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-white rounded-md bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-700 hover:to-violet-700"
          >
            Read Article
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Visit Source
          </motion.a>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl dark:bg-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-bold">
                  {title}
                </h2>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReadToggle}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1 text-sm rounded-full",
                      isRead
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    )}
                  >
                    {isRead ? "✓ Read" : "○ Mark as read"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onFavoriteToggle}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1 text-sm rounded-full",
                      isFavorite
                        ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    )}
                  >
                    {isFavorite
                      ? "★ Favorited"
                      : "☆ Favorite"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {publishedAt}
                  </span>
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-pink-600 hover:underline dark:text-pink-400"
                  >
                    View Original Source
                  </motion.a>
                </div>
                <div
                  className="prose prose-pink max-w-none dark:prose-invert article-content"
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
