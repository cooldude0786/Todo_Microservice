# Authentication Fundamentals

- API Gateway issues JWT in auth controller (`register`, `login`).
- API Gateway protects todo routes with bearer-token middleware.
- Frontend NextAuth credentials provider calls `http://localhost:4000/api/auth/login` and stores `accessToken` in JWT/session callbacks.
- Root `middleware.ts` checks for `session_token` cookie on page-route access.
