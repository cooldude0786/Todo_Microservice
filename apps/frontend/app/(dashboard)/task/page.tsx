import { Suspense } from "react";
import TaskPageClient from "./TaskPageClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TaskPageClient />
    </Suspense>
  );
}
