# HTTP Surfaces

Two HTTP surfaces currently exist:

1. Gateway surface (`/api/todos`, `/api/auth/*`) in `apps/api-gateway`.
2. Frontend internal API surface (`/api/tasks`, `/api/auth/*`, `/api/session`) in `apps/frontend/app/api`.

Current implemented routing in frontend task API routes proxies to `http://localhost:4000/api/tasks`.
