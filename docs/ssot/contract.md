# Contract SSOT

Current implemented contract surfaces:

1. API Gateway routes in `apps/api-gateway/src/routes/*`.
2. Frontend internal API routes in `apps/frontend/app/api/*`.
3. NextAuth credentials flow contract in `apps/frontend/app/api/auth/[...nextauth]/route.ts`.

Current note:
- Gateway todo contract is on `/api/todos`.
- Gateway group contract is on `/api/groups`.
- Frontend internal task routes proxy to `/api/todos` at the gateway.
