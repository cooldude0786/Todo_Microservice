# Todo App Setup Guide

This guide matches the current implemented architecture in this repository.

## Current Services

- Frontend: `apps/frontend` (Next.js)
- API Gateway: `apps/api-gateway` (Express + auth + todo APIs)
- AI Service: `apps/ai-service` (Express)
- Shared DB package: `packages/shared` (Prisma schema/client)

## Prerequisites

- Node.js 18+
- pnpm 10+
- PostgreSQL 12+

## Install

```bash
pnpm install
```

## Environment

Use `.env.example` as the base reference.

### Root `.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-me
JWT_EXPIRES_IN=7d
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-me
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
AI_SERVICE_PORT=5000
BACKEND_API_URL=http://localhost:4000
```

### App-specific files currently used

- `apps/frontend/.env.local`
- `apps/api-gateway/.env`
- `apps/ai-service/.env`
- `packages/shared/.env`

## Database Setup

```bash
pnpm db:generate
pnpm db:push
```

Optional:

```bash
pnpm db:studio
```

## Run in Development

```bash
pnpm dev
```

This runs:
- Frontend on `http://localhost:3000`
- API Gateway on `http://localhost:4000`
- AI Service on its configured port

## Run Individual Services

```bash
pnpm dev:frontend
pnpm dev:api
pnpm dev:ai
```

## Core API Smoke Tests

### Register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Todo

```bash
curl -X POST http://localhost:4000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"My First Todo","description":"This is my first todo item","priority":"high"}'
```

### List Todos

```bash
curl -X GET http://localhost:4000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Health Checks

```bash
curl http://localhost:4000/health
curl http://localhost:5000/health
```

## Documentation

- Implemented-state SSOT: `docs/ssot/`
- Target architecture/policy: `docs/architecture/`
- Contributor flows: `docs/guides/`
- API reference: `API_DOCUMENTATION.md`
