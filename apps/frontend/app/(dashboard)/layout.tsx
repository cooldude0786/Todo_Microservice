'use client'

import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ErrorBoundary } from "@/components/error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full">
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>

        <main className="flex-1 px-6 py-5">
          <div className="mx-auto w-full max-w-300">
            {children}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
