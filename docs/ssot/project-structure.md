# Todo App Monorepo Workspace SSOT

## Folder Tree

```txt
todo-app/
  apps/
    frontend/
      app/
      components/
      hooks/
      lib/
      actions/
      public/
    api-gateway/
      src/
        controllers/
        middleware/
        routes/
        types/
        utils/
    ai-service/
      src/
        config/
  packages/
    shared/
      prisma/
      src/
      dist/
  docs/
    ssot/
    architecture/
    guides/
  .vscode/
  pnpm-workspace.yaml
  package.json
  turbo.json
```

## Organization and Workspace Guidance

- This repository is a `pnpm` monorepo rooted at `todo-app/`.
- Workspace package discovery is defined in `pnpm-workspace.yaml` with:
  - `apps/*`
  - `packages/*`
- Active apps currently in `apps/`:
  - `frontend` (Next.js UI application)
  - `api-gateway` (Express API gateway)
  - `ai-service` (Express AI service)
- Shared package currently in `packages/`:
  - `shared` (`@todo-app/shared`, Prisma schema/client and shared DB exports)
- Root scripts in `package.json` are the source of truth for multi-service dev execution:
  - `pnpm dev` runs `frontend`, `api-gateway`, and `ai-service` together.
  - `pnpm dev:frontend`, `pnpm dev:api`, `pnpm dev:ai` run each app independently.
- Current workspace-level structure rule:
  - application runtime code belongs in `apps/<app-name>/`
  - reusable shared package code belongs in `packages/<package-name>/`
  - implemented-state source-of-truth docs belong in `docs/ssot/`
  - target/policy architecture docs belong in `docs/architecture/`
  - contributor execution guides belong in `docs/guides/`
- VS Code workspace guidance for focused contexts:
  - keep frontend-focused work scoped to the root plus `apps/frontend`
  - keep backend-focused work scoped to the root plus `apps/api-gateway`, `apps/ai-service`, and `packages/shared`
  - `.code-workspace` files are not currently committed in this repository; if used, they are local developer convenience files and should follow the same folder scoping above
