# Service Inventory

## Frontend (`apps/frontend`)

- Next.js application with App Router pages under `app/`.
- Uses NextAuth credentials provider in `app/api/auth/[...nextauth]/route.ts`.
- Has internal API routes under `app/api/` including `auth`, `session`, and `tasks`.

## API Gateway (`apps/api-gateway`)

- Express server entrypoint in `src/index.ts`.
- Exposes:
  - `GET /health`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/verify`
  - `POST /api/todos`
  - `GET /api/todos`
  - `GET /api/todos/:id`
  - `PUT /api/todos/:id`
  - `PATCH /api/todos/:id`
  - `DELETE /api/todos/:id`

## AI Service (`apps/ai-service`)

- Express service with:
  - `GET /health`
  - `POST /api/ai/analyze` (placeholder analysis response)

## Shared Package (`packages/shared`)

- Prisma schema in `prisma/schema.prisma`.
- Exposes generated Prisma client for other apps.
