# Add a New API

This guide describes the current flow for adding an API endpoint.

## 1. Define API Contract

Specify:
- Method + path
- Request body/query/params
- Response JSON shape
- Auth requirement
- Error cases

## 2. Choose Service Location

Current options:
- Main app APIs: `apps/api-gateway`
- AI-specific APIs: `apps/ai-service`

For normal todo/auth business APIs, use `apps/api-gateway`.

## 3. Implement in API Gateway

1. Add controller function:
- `apps/api-gateway/src/controllers/<module>.controllers.ts`

2. Add route mapping:
- `apps/api-gateway/src/routes/<module>.routes.ts`

3. Ensure route is mounted:
- `apps/api-gateway/src/index.ts`

4. Add auth middleware if required:
- `authenticateToken` from `apps/api-gateway/src/middleware/auth.middleware.ts`

## 4. If DB Access Is Needed

Use Prisma from shared package:
- import from `@todo-app/shared`

If schema changes are needed:
1. edit `packages/shared/prisma/schema.prisma`
2. run `pnpm db:generate`
3. run `pnpm db:push` (or migration flow)

## 5. Connect Frontend

You may need one or both:

1. Direct frontend service call updates:
- `apps/frontend/lib/todo-service.ts` (or related client helper)

2. Frontend internal API route proxy updates:
- `apps/frontend/app/api/.../route.ts`

Important: keep endpoint naming consistent between frontend callers and gateway routes.

## 6. Test Flow

1. Health check:
- `GET /health` on target service

2. Endpoint test:
- call new endpoint with valid and invalid payloads

3. Auth test:
- no token (expect unauthorized if protected)
- valid token (expect success)

4. Data test:
- verify DB state if write endpoint

## 7. Document the API

- Update `docs/ssot/*.md` for implemented behavior changes.
- Update `docs/architecture/*.md` only if target-state rules/direction changed.
- Update `API_DOCUMENTATION.md` if your team still uses it as consumer-facing API reference.
