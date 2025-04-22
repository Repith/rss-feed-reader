"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { articlesApi } from "@/src/lib/api-client";
import Link from "next/link";
import { format } from "date-fns";

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: articlesApi.getFavorites,
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
        queryKey: ["favorites"],
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

      {isLoading ? (
        <div className="text-center">
          Loading favorites...
        </div>
      ) : articles?.length === 0 ? (
        <div className="p-8 text-center border rounded-lg">
          <p className="text-lg">
            You don&apos;t have any favorite articles yet.
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Mark articles as favorites to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles?.map((article) => (
            <div
              key={article.id}
              className="p-4 border rounded-lg shadow-sm"
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
                <button
                  onClick={() =>
                    favoriteArticleMutation.mutate({
                      id: article.id,
                      isFavorite: false,
                    })
                  }
                  className="text-sm text-yellow-500 hover:text-gray-500"
                >
                  ★ Remove from favorites
                </button>
              </div>
              <h2 className="mb-2 text-xl font-medium">
                {article.title}
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {article.content?.substring(0, 200)}
                {article.content &&
                article.content.length > 200
                  ? "..."
                  : ""}
              </p>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 text-white rounded-md bg-primary-600 hover:bg-primary-700"
              >
                Read Article
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
