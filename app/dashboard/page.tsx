"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { feedsApi } from "@/src/lib/api-client";
import { motion } from "framer-motion";
import { FeedForm } from "@/src/components/dashboard/FeedForm";
import { FeedTabs } from "@/src/components/dashboard/FeedTabs";
import { FeedList } from "@/src/components/dashboard/FeedList";
import {
  LoadingState,
  EmptyState,
} from "@/src/components/dashboard/LoadingState";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: feeds, isLoading } = useQuery({
    queryKey: ["feeds"],
    queryFn: feedsApi.getAll,
  });

  const feedCategories =
    feeds?.reduce((acc, feed) => {
      const category = feed.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(feed);
      return acc;
    }, {} as Record<string, typeof feeds>) || {};

  const categories = [
    "all",
    ...Object.keys(feedCategories),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-5xl p-4 mx-auto"
    >
      <FeedForm />

      {isLoading ? (
        <LoadingState />
      ) : feeds?.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FeedTabs
            categories={categories}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <FeedList feeds={feeds} activeTab={activeTab} />
        </>
      )}
    </motion.div>
  );
}
