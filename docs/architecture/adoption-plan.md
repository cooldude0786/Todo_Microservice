# Adoption Plan

These steps are listed in `ARCHITECTURE_SSOT.md` as the planned incremental path:

1. Define canonical endpoint naming (`todos` or `tasks`) and align callers.
2. Introduce explicit `domain` + `contract` modules in `packages/shared`.
3. Move business logic from controllers into service modules.
4. Consolidate frontend API usage into one client surface.
5. Align middleware/auth flow to one consistent session strategy.
6. Replace legacy docs with this model as canonical.

This file records the plan text only; it is not a status tracker.
