# Runtime Topology

- Frontend runs on `http://localhost:3000`.
- API Gateway runs on `http://localhost:4000`.
- AI Service runs on its configured env port.
- PostgreSQL is accessed through Prisma in `packages/shared`.

Request flow:
1. User interacts with frontend pages.
2. Frontend authenticates via NextAuth credentials provider.
3. NextAuth provider calls API Gateway `POST /api/auth/login`.
4. Frontend task views call API Gateway todo endpoints with bearer token.
5. API Gateway controllers use Prisma client from `@todo-app/shared`.
6. Prisma talks to PostgreSQL.
