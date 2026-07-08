import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThreeBackground } from "@/components/three-background"
import NextAuthProvider from "@/components/session-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ErrorBoundary } from "@/components/error-boundary";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application with authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900`}
      >
        <ErrorBoundary>
          <NextAuthProvider>
            <ThreeBackground />
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}