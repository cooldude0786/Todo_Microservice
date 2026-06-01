# UI State SSOT

Current UI state ownership points:

- Task list page state in:
  - `apps/frontend/app/(dashboard)/task/TaskPageClient.tsx`
- Task detail page state in:
  - `apps/frontend/app/(dashboard)/task/[id]/TaskDetailClient.tsx`

Current implemented pattern:
- Local React state (`useState`, `useEffect`, `useMemo`) manages task and loading/error state.
