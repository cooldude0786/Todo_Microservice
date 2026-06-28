# Add a New Feature

This guide describes the current flow for adding a feature in this repository.

## 1. Define Feature Scope

Write down:
- User-visible behavior
- Required API behavior
- Required data changes
- Auth requirement (public vs authenticated)

Keep this short and testable.

## 2. Decide Which Apps Are Involved

- UI-only change: `apps/frontend`
- UI + backend behavior: `apps/frontend` + `apps/api-gateway`
- Data model change: update `packages/shared/prisma/schema.prisma`
- AI behavior: update `apps/ai-service`

## 3. If Data Model Changes Are Needed

1. Update Prisma schema:
- `packages/shared/prisma/schema.prisma`

2. Apply non-breaking schema rules:
- Prefer adding new models/optional relation fields.
- Avoid renaming/removing existing fields in the same feature rollout.
- Ensure existing records remain valid without backfill failure.

3. Run:
- `pnpm db:generate`
- `pnpm db:push` (or migrate flow if you are using migrations)

4. Update API Gateway logic using the updated Prisma client.

## 4. Backend Feature Flow (API Gateway)

1. Add or update controller logic:
- `apps/api-gateway/src/controllers/*.ts`

2. Add or update route mapping:
- `apps/api-gateway/src/routes/*.ts`

3. Register routes if needed:
- `apps/api-gateway/src/index.ts`

4. If auth required, use middleware:
- `apps/api-gateway/src/middleware/auth.middleware.ts`

5. Keep current contracts stable:
- Do not change existing response shape by default.
- Add new behavior via optional fields/query params or new endpoints.

## 5. Frontend Feature Flow

1. Add/update page or component:
- `apps/frontend/app/...`
- `apps/frontend/components/...`

2. Add/update API calling layer:
- `apps/frontend/lib/todo-service.ts` (or related client file)
- If using internal API route handlers, update `apps/frontend/app/api/...`

3. If feature is auth-sensitive, verify NextAuth/session usage in:
- `apps/frontend/app/api/auth/[...nextauth]/route.ts`
- page/client hooks using `useSession`

## 6. Validate End-to-End

1. Start services:
- `pnpm dev`

2. Validate:
- UI behavior
- API response
- DB write/read behavior
- Auth behavior (if applicable)

3. Check browser console and backend logs for errors.

## 7. Update Docs

- Update `docs/ssot/*.md` for implemented behavior changes.
- Update `docs/architecture/*.md` only if target-state rules/direction changed.
- Update `docs/guides/*.md` only if contributor process changed.
