# Client SSOT

Current frontend API calling points:

- `apps/frontend/lib/todo-service.ts`
- `apps/frontend/lib/api-client.ts`
- `apps/frontend/app/api/tasks/route.ts`
- `apps/frontend/app/api/tasks/[id]/route.ts`

Current implemented behavior:
- Client code sends bearer token from NextAuth session access token.
