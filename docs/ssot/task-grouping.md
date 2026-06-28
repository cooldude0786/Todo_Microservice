# Task Grouping Status (SSOT)

## Current Implemented State

- Task grouping is implemented.
- Persisted models now include `Group` and optional `Todo.groupId`.
- Existing default task listing behavior remains a flat list on `GET /api/todos`.
- Grouped response is opt-in using `GET /api/todos?view=grouped`.
- Group CRUD is available on `/api/groups`.

## Current Source-of-Truth Constraint for This Feature

- Grouping is implemented as a **non-breaking additive change**.
- Existing tasks must remain valid and readable without migration conflicts.
- Existing default task list behavior must continue to work for current clients.

## Canonical Contributor Rules

- The implementation rules for this feature are documented in:
  - `docs/guides/non-breaking-changes.md`
- Checklist enforcement for compatibility is documented in:
  - `docs/guides/change-checklist.md`
