"use client";

import { ThemeProvider } from "@/src/components/ThemeProvider";
import { AuthProvider } from "@/src/lib/auth-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/src/lib/query-client";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
