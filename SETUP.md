# Todo App Setup Guide

This guide will help you set up and run the Todo App from scratch.

## Prerequisites

- Node.js 18+ (and npm or pnpm)
- PostgreSQL 12+
- Docker (optional, for PostgreSQL)

## Installation Steps

### 1. Install Dependencies

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm@10.22.0

# Install all dependencies
pnpm install
```

### 2. Set Up Environment Variables

Copy the `.env.example` file and create `.env.local` files in each service:

```bash
cp .env.example .env.local
```

Then configure the following:

#### Root `.env.local`
```
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app
JWT_SECRET=your-secret-key-change-me
NEXTAUTH_SECRET=your-nextauth-secret-change-me
```

#### Frontend `.env.local` (apps/frontend)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-me
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

#### Auth Service `.env.local` (apps/auth-service)
```
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app
JWT_SECRET=your-secret-key-change-me
PORT=4001
NODE_ENV=development
```

#### API Gateway `.env.local` (apps/api-gateway)
```
PORT=4000
AUTH_SERVICE_URL=http://localhost:4001
NODE_ENV=development
```

#### Other Services `.env.local` (todo-*-service apps)
```
DATABASE_URL=postgresql://user:password@localhost:5432/todo_app
JWT_SECRET=your-secret-key-change-me
PORT=400X (4002, 4003, 4004, 4005)
NODE_ENV=development
```

### 3. Set Up Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) View database in Prisma Studio
pnpm db:studio
```

### 4. Build the Project

```bash
pnpm build
```

## Running the Application

### Development Mode (All Services)

Run all services in development mode with a single command:

```bash
pnpm dev
```

This starts:
- Frontend on http://localhost:3000
- API Gateway on http://localhost:4000
- Auth Service on http://localhost:4001
- Todo Create Service on http://localhost:4002
- Todo Read Service on http://localhost:4003
- Todo Update Service on http://localhost:4004
- Todo Delete Service on http://localhost:4005

### Individual Service Development

If you want to run services individually:

```bash
# Terminal 1: Frontend
pnpm dev:frontend

# Terminal 2: API Gateway
pnpm dev:gateway

# Terminal 3: Auth Service
pnpm dev:auth

# Terminal 4: Create Service
pnpm dev:create

# Terminal 5: Read Service
pnpm dev:read

# Terminal 6: Update Service
pnpm dev:update

# Terminal 7: Delete Service
pnpm dev:delete
```

## Testing the Application

### 1. Register a New User

Visit http://localhost:3000 and click "Sign Up"

Or use the API:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 2. Login

Visit http://localhost:3000/login

Or use the API:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a Todo

After logging in, use the UI or API:

```bash
curl -X POST http://localhost:4000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Todo",
    "description": "This is my first todo item",
    "priority": "high",
    "dueDate": "2024-12-31"
  }'
```

### 4. View Todos

```bash
curl -X GET http://localhost:4000/api/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Update a Todo

```bash
curl -X PUT http://localhost:4000/api/todos/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "completed": true
  }'
```

### 6. Delete a Todo

```bash
curl -X DELETE http://localhost:4000/api/todos/TASK_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Health Checks

Check if services are running:

```bash
# Health check for API Gateway
curl http://localhost:4000/health
```

## Troubleshooting

### Database Connection Error

Ensure PostgreSQL is running:

```bash
# On macOS with Homebrew
brew services start postgresql

# On Linux with systemctl
sudo systemctl start postgresql

# Or with Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=todo_app \
  -p 5432:5432 \
  postgres:15
```

### Port Already in Use

If a port is already in use, either:
1. Stop the process using the port
2. Change the PORT in the service's `.env.local`

### JWT Token Issues

Make sure `JWT_SECRET` is consistent across all services. Change it in all `.env.local` files.

### CORS Issues

Ensure the API Gateway has CORS enabled and the frontend URL is properly configured.

## Project Structure

```
todo-app/
├── apps/
│   ├── frontend/              # Next.js frontend
│   ├── api-gateway/           # Express gateway
│   ├── auth-service/          # Authentication service
│   ├── todo-create-service/   # Create todos
│   ├── todo-read-service/     # Read todos
│   ├── todo-update-service/   # Update todos
│   └── todo-delete-service/   # Delete todos
├── packages/
│   └── shared/                # Shared types and Prisma schema
└── [Configuration files]
```

## Key Features Completed

✅ User authentication (Register & Login)
✅ JWT-based authorization
✅ Task creation, reading, updating, deletion
✅ Task detail page with edit/delete functionality
✅ User logout
✅ API Gateway with request logging and error handling
✅ Error boundaries on frontend
✅ Security: User isolation (can only access own tasks)

## API Documentation

See `API_DOCUMENTATION.md` for detailed endpoint specifications.
