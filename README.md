# Todo App Setup Guide

This project is a monorepo with:
- a Next.js frontend in apps/frontend
- an Express API gateway in apps/api-gateway
- a shared Prisma package in packages/shared

## Recommended deployment setup
- Frontend: Vercel
- Database: Neon Postgres
- API: Render (recommended for the Express backend)

---

## 1) Prerequisites

Install:
- Node.js 20+
- pnpm
- A Neon database
- A Vercel account
- A Render account (for the API backend)

---

## 2) Local development

From the repository root:

```bash
pnpm install
```

### Frontend environment
Create or update the file:

```bash
apps/frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
```

### API environment
Create or update the file:

```bash
apps/api-gateway/.env
```

Add:

```env
PORT=4000
JWT_SECRET=your-random-jwt-secret
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

### Database setup
Run Prisma migrations / db push:

```bash
pnpm --filter @todo-app/shared db:push
```

If you prefer migrations:

```bash
pnpm --filter @todo-app/shared db:migrate
```

Start the app locally:

```bash
pnpm dev
```

---

## 3) Neon database setup

1. Create a new project in Neon.
2. Copy the connection string.
3. Use it as the DATABASE_URL value for the API service.
4. Make sure the URL uses sslmode=require.

Example:

```env
DATABASE_URL=postgresql://user:password@ep-abc123.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 4) Deploy the API to Render

The repository already includes a Render config file:

```bash
render.yaml
```

### Render service settings
For the API service, set these environment variables:
- NODE_ENV=production
- PORT=10000
- JWT_SECRET=<generate-a-secure-value>
- DATABASE_URL=<your-neon-connection-string>

Render will build and start the Express API from apps/api-gateway.

After deployment, copy the Render API URL, for example:

```text
https://your-api-name.onrender.com
```

---

## 5) Deploy the frontend to Vercel

1. Import the repository into Vercel.
2. Set the project root to:

```text
apps/frontend
```

3. Use the following build command:

```bash
pnpm install --frozen-lockfile && pnpm --filter @todo-app/shared build && pnpm --filter frontend build
```

4. Set these environment variables in Vercel:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-name.onrender.com
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=https://your-frontend-app.vercel.app
AUTH_TRUST_HOST=true
```

5. Deploy.

---

## 6) Important notes

- The frontend uses NEXT_PUBLIC_API_BASE_URL to call the API.
- The API must be reachable from the internet for the frontend to work.
- If you change the frontend domain, update NEXTAUTH_URL and any related auth settings.
- If you change the API domain, update NEXT_PUBLIC_API_BASE_URL in Vercel.

---

## 7) Troubleshooting

### Frontend cannot reach the API
Check that:
- NEXT_PUBLIC_API_BASE_URL points to the correct deployed API URL
- the API service is running
- the API has CORS enabled for the frontend domain

### Auth not working
Check that:
- NEXTAUTH_SECRET is set
- NEXTAUTH_URL matches your Vercel frontend domain
- JWT_SECRET is set on the API

### Database errors
Check that:
- DATABASE_URL is correct
- the Neon database is reachable
- Prisma has been pushed to the database
