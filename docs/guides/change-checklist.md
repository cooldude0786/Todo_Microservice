# End-to-End Change Checklist

Use this checklist before marking a feature/API change done.

## Implementation

- [ ] Code added in correct app(s): frontend, api-gateway, ai-service, shared
- [ ] No duplicate business rules across layers
- [ ] Endpoint names are consistent across caller and server

## Data

- [ ] Prisma schema updated if needed
- [ ] Prisma client regenerated if schema changed
- [ ] DB changes validated with test data

## Authentication

- [ ] Protected endpoints use auth middleware
- [ ] Frontend session/token usage works for changed flow
- [ ] Route protection behavior is still correct

## Testing

- [ ] Manual happy-path test passed
- [ ] Manual error-path test passed
- [ ] Relevant health endpoints respond

## Documentation

- [ ] `docs/ssot/*` updated for implemented behavior changes
- [ ] `docs/architecture/*` updated only if target-state rules changed
- [ ] `API_DOCUMENTATION.md` updated if your team uses it and endpoint behavior changed
- [ ] `docs/guides/*` updated if contributor process changed
