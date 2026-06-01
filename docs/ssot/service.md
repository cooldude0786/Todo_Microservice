# Service Behavior Locations

This file maps where service-level behavior is currently implemented in code.

- Auth behavior:
  - `apps/api-gateway/src/controllers/auth.controllers.ts`
- Todo behavior:
  - `apps/api-gateway/src/controllers/todo.controllers.ts`
- AI behavior:
  - `apps/ai-service/src/index.ts` (`POST /api/ai/analyze` placeholder)

Current implemented pattern:
- API Gateway business behavior is implemented directly in controllers.
