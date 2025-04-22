"use client";

import { AuthProvider } from "@/src/lib/auth-context";
import { queryClient } from "@/src/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LayoutWrapper } from "@/src/components/LayoutWrapper";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <LayoutWrapper>{children}</LayoutWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
}
