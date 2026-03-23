"use client";

import { Toaster } from "@/components/ui/sonner";

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
