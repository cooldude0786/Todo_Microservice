# Project Structure and Fundamentals (SSOT)

This document is the canonical overview of the current architecture in this repository and the modular SSOT pattern we will follow.

## Linked SSOT Files

- Project structure: `docs/ssot/project-structure.md`
- Runtime topology: `docs/ssot/runtime-topology.md`
- Domain SSOT: `docs/ssot/domain.md`
- Contract SSOT: `docs/ssot/contract.md`
- Data fundamentals: `docs/ssot/data.md`
- Service SSOT: `docs/ssot/service.md`
- Client SSOT: `docs/ssot/client.md`
- UI state SSOT: `docs/ssot/ui-state.md`
- Dependency rule: `docs/architecture/dependency-rule.md`
- Module boundaries: `docs/architecture/module-boundaries.md`
- Implemented mismatches: `docs/ssot/mismatches.md`
- Source references: `docs/ssot/sources.md`
- Adoption plan: `docs/architecture/adoption-plan.md`

## 1) Current Repository Structure

```txt
todo-app/
  apps/
    frontend/      # Next.js app (UI, NextAuth integration, client-side task UX)
    api-gateway/   # Express API (auth + todo endpoints)
    ai-service/    # Independent AI microservice (currently placeholder analysis endpoint)
  packages/
    shared/        # Prisma schema + generated client exports
```

## 2) Runtime Topology

- Frontend runs on `http://localhost:3000`
- API Gateway runs on `http://localhost:4000`
- AI Service runs on its own port (from env)
- PostgreSQL is accessed through Prisma in `packages/shared`

Main request flow:
1. User interacts with frontend pages.
2. Frontend authenticates via NextAuth credentials provider.
3. NextAuth provider calls API Gateway `/api/auth/login`.
4. Frontend task views call API Gateway todo endpoints with bearer token.
5. API Gateway controllers use Prisma client from `@todo-app/shared`.
6. Prisma talks to PostgreSQL.

## 3) SSOT Pattern (Top to Bottom)

We use linked, independent modules where each layer owns exactly one source of truth.

1. Domain SSOT
- Owns business language and invariants.
- Examples: todo priority enum, title constraints, auth requirements.

2. Contract SSOT
- Owns API input/output schemas and route contracts.
- Must be derived from domain rules.

3. Data SSOT
- Owns persistence schema and migrations.
- Implemented via Prisma schema in `packages/shared/prisma/schema.prisma`.

4. Service SSOT
- Owns use-case behavior (register user, create todo, update todo).
- Controllers should only adapt HTTP to service calls.

5. Client SSOT
- Owns frontend API calling rules and response shaping.
- UI components should not duplicate endpoint details.

6. UI State SSOT
- Owns normalized task/session state for rendering.
- Components consume state; they should not re-implement fetch logic.

## 4) Dependency Rule (Critical)

Allowed direction is strictly downward:

`UI -> Client -> Contract -> Domain`
`API Controller -> Service -> Domain + Data`

Disallowed:
- Sideways feature imports (feature-to-feature direct coupling)
- UI importing DB/data layer
- Controller implementing domain rules directly

## 5) Module Boundaries in This Repo

- `apps/frontend`
  - Owns rendering, route UX, and NextAuth session consumption.
  - Should depend on a single client module for todo/auth API calls.

- `apps/api-gateway`
  - Owns HTTP routes, middleware, and response mapping.
  - Should delegate business decisions to service modules.

- `packages/shared`
  - Owns Prisma schema + generated DB client.
  - Should not contain UI or HTTP-specific code.

- `apps/ai-service`
  - Owns AI-specific endpoints and config.
  - Should integrate via contract/domain, not ad hoc payloads.

## 6) Current Gaps to Resolve

1. Endpoint naming drift (`/api/tasks` vs `/api/todos`) in frontend API routes.
2. Documentation drift from old architecture assumptions.
3. Mixed auth assumptions (NextAuth session + custom cookie middleware behavior).
4. Empty actions modules in frontend (`actions/auth-actions.ts`, `actions/todo-actions.ts`) with logic distributed elsewhere.

## 7) Fundamentals We Will Preserve

- Single definition per concern (no duplicated truths).
- Explicit module ownership.
- Stable contracts between layers.
- Backward-compatible incremental refactors.
- Documentation updated with each structural change.

## 8) Suggested Incremental Adoption Plan

1. Define canonical endpoint naming (`todos` or `tasks`) and align all callers.
2. Introduce explicit `domain` + `contract` modules in `packages/shared`.
3. Move business logic from controllers into service modules.
4. Consolidate frontend API usage into one client surface.
5. Align middleware/auth flow to one consistent session strategy.
6. Replace legacy docs with this model as canonical.

---

If any behavior in code conflicts with this document, treat code behavior as temporary and open a refactor task to realign toward this SSOT model.

