"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}