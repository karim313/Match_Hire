'use client'

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PageLoader } from "./PageLoader";
import Background3D from "./Background3D";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        <PageLoader />
        <Background3D />
        {children}
        <Toaster position="top-center" expand={true} richColors />
      </ThemeProvider>
    </SessionProvider>
  );
}
