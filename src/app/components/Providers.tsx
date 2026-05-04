'use client'

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { PageLoader } from "./PageLoader";

const DarkVeil = dynamic(() => import('./DarkVeil'), { ssr: false });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
          {/* Page loader — shown on initial load */}
          <PageLoader />
          {/* Background layer: z=0, fixed behind everything */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <DarkVeil hueShift={-20} speed={0.4} noiseIntensity={0.03} />
          </div>
          {children}
          <Toaster position="top-center" expand={true} richColors />
        </ThemeProvider>
      </SessionProvider>
    </AuthProvider>
  );
}

