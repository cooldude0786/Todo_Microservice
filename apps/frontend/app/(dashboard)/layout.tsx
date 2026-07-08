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
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-5">
            {children}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}
