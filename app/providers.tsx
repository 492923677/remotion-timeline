"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({
  children
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="next-ui-theme">
      {children}
    </ThemeProvider>
  );
}
